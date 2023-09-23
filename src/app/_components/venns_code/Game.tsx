import { Game } from "boardgame.io";
import { TurnOrder } from "boardgame.io/core";
import { VennsCodeState, Roles, Teams, Sets } from "./Model";

function findTeamAndRole(team: Teams, role: Roles, G: VennsCodeState) {
  const teamFilterIds = Object.entries(G.teams)
    .filter(([_, tmpTeam]) => tmpTeam === team)
    .map(([id, _]) => {
      return id;
    });
  const roleFilterIds = Object.entries(G.roles)
    .filter(([_, tmpRole]) => tmpRole === role)
    .map(([id, _]) => {
      return id;
    });
  const commonIds = teamFilterIds.filter((id) => roleFilterIds.includes(id));
  return commonIds[0];
}

function findGM(G: VennsCodeState) {
  return findTeamAndRole(Teams.GM, Roles.GM, G);
}

const VennsCode: Game<VennsCodeState> = {
  name: "venns-code",
  setup: () => {
    const topics: VennsCodeState["topics"] = {
      a: "",
      b: "",
      c: "",
    };

    const roles: { [playerID: string]: Roles } = {};
    const teams: { [playerID: string]: Teams } = {};

    return {
      topics,
      roles,
      teams,
      hints: [],
      guesses: [],
      score: {
        teamA: 0,
        teamB: 0,
      },
    };
  },

  phases: {
    setupPhase: {
      start: true,
      moves: {
        endSetupPhase: ({ G, events }) => {
          events.endPhase();
        },
        shuffleRolesAndTeams: ({ G, ctx, random }) => {
          // Shuffle the players
          const shuffledPlayers = random.Shuffle(ctx.playOrder);

          // Assign GM
          G.roles[shuffledPlayers[0]] = Roles.GM;
          G.teams[shuffledPlayers[0]] = Teams.GM;

          // Assign Questioner for each team
          G.roles[shuffledPlayers[1]] = Roles.Questioner;
          G.teams[shuffledPlayers[1]] = Teams.A;
          G.roles[shuffledPlayers[2]] = Roles.Questioner;
          G.teams[shuffledPlayers[2]] = Teams.B;

          // All other players are Answerers
          // Split the remaining players as evenly as possible between the two teams
          const remainingPlayers = shuffledPlayers.slice(3);

          for (const player of remainingPlayers) {
            G.roles[player] = Roles.Answerer;
          }

          const mid = Math.ceil(remainingPlayers.length / 2);
          const teamAPlayers = remainingPlayers.slice(0, mid);
          const teamBPlayers = remainingPlayers.slice(mid);

          for (const player of teamAPlayers) {
            G.teams[player] = Teams.A;
          }

          for (const player of teamBPlayers) {
            G.teams[player] = Teams.B;
          }
        },
      },
      next: "assignTopicPhase",
    },
    assignTopicPhase: {
      turn: {
        order: {
          ...TurnOrder.DEFAULT,
          first: ({ G }) => {
            // GMのplayerIDを返すロジック
            const gm = Object.entries(G.roles).find(
              ([id, role]) => role === Roles.GM,
            );
            if (!gm) {
              throw new Error("GMが存在しません");
            }
            const playerID = gm[0];
            return Number(playerID);
          },
        },
      },
      moves: {
        endAssignTopicPhase: ({ G, events, playerID }) => {
          // GMのみがこのmoveを呼び出せるようにする
          if (G.roles[playerID] !== Roles.GM) {
            throw new Error(`GMのみがお題の割り当てを終了できます`);
          }
          events.endPhase();
        },
        assignTopic: ({ G }, setID: Sets, topic: string) => {
          G.topics[setID] = topic;
        },
      },
      next: "mainPhase",
    },
    mainPhase: {
      turn: {
        order: {
          ...TurnOrder.DEFAULT,
          first: ({ G }) => {
            // 最初はチームAの出題者のターン
            return Number(findTeamAndRole(Teams.A, Roles.Questioner, G));
          },
        },
      },
      moves: {
        provideHint: ({ G }, team: Teams, region: string, word: string) => {
          // Check that the team is either 'A' or 'B'
          if (team === Teams.GM) {
            throw new Error(`Invalid team for hint: ${team}`);
          }
          // とりあえずデバッグプリント
          console.log("team: ", team);
          console.log("region: ", region);
          console.log("word: ", word);
          // G.hints.push({ team, region, word });
        },

        makeGuess: ({ G }, team: Teams, setID: Sets, topicGuess: string) => {
          // Check that the team is either 'A' or 'B'
          if (team === Teams.GM) {
            throw new Error(`Invalid team for guess: ${team}`);
          }
          G.guesses.push({ team, setID, topicGuess });
          // 正解判定とスコアの計算もここで行う (詳細は後で追加)
        },
      },
    },
  },
};

export default VennsCode;
