import { Game } from "boardgame.io";
import { TurnOrder } from "boardgame.io/core";

export type VennsCodeState = {
  roles: {
    GM: string | null;
    TeamAQuestioner: string | null;
    TeamBQuestioner: string | null;
  };
  teams: {
    TeamA: string[];
    TeamB: string[];
  };
};

const VennsCode: Game<VennsCodeState> = {
  name: "venns-code",

  setup: () => ({
    roles: {
      GM: null,
      TeamAQuestioner: null,
      TeamBQuestioner: null,
    },
    teams: { TeamA: [], TeamB: [] },
  }),

  turn: {
    order: TurnOrder.DEFAULT,
  },

  phases: {
    setupPhase: {
      start: true,
      moves: {
        shuffleRolesAndTeams: ({ G, ctx, random }) => {
          // Shuffle the players
          const shuffledPlayers = random.Shuffle(ctx.playOrder);

          // Assign GM
          G.roles.GM = shuffledPlayers[0];

          // Assign Questioner for each team
          G.roles.TeamAQuestioner = shuffledPlayers[1];
          G.roles.TeamBQuestioner = shuffledPlayers[2];

          // All other players are Answerers
          // Split the remaining players as evenly as possible between the two teams
          const remainingPlayers = shuffledPlayers.slice(3);
          const mid = Math.ceil(remainingPlayers.length / 2);

          G.teams.TeamA = [
            shuffledPlayers[1],
            ...remainingPlayers.slice(0, mid),
          ];
          G.teams.TeamB = [shuffledPlayers[2], ...remainingPlayers.slice(mid)];
        },
      },
      endIf: ({ G }) =>
        G.roles.GM !== null &&
        G.roles.TeamAQuestioner !== null &&
        G.roles.TeamBQuestioner !== null,
      next: "mainPhase",
    },
    mainPhase: {
      // Main phase logic will be implemented later
    },
  },

  moves: {
    // Main game moves will be implemented later
  },
};

export default VennsCode;
