import type { Ctx, Game } from "boardgame.io";
import {
  Card,
  CodenamesState,
  Hint,
  Role,
  RoleType,
  Team,
  TeamType,
} from "./Model";
import { INVALID_MOVE } from "boardgame.io/core";

export const cardNum = 25;
export const cardNumOfTeamA = 9;
export const cardNumOfTeamB = 8;
export const cardNumOfTeamMine = 1;
export const cardNumOfTeamNoSide = 7;

const getEmptyCard: (id: number) => Card = (id) => ({
  id: id,
  word: "",
  team: Team.NO_SIDE,
  isOpen: false,
});

export const initialGameState = (() => {
  const roles: { [playerID: string]: RoleType } = {};
  const teams: { [playerID: string]: TeamType } = {};
  const cards: Card[] = Array.from({ length: cardNum }, (_, i) =>
    getEmptyCard(i),
  );
  const hint: Hint = {
    keyword: "現在のヒント",
    count: 0,
    team: Team.NO_SIDE,
  };

  return {
    roles,
    teams,
    cards,
    hint,
  };
})();

const isTeamAWinning = (G: CodenamesState, ctx: Ctx) => {
  const openedCard = G.cards.filter((card) => card.isOpen);
  if (
    openedCard.filter((card) => card.team === Team.A).length === cardNumOfTeamA
  ) {
    return true;
  }
  const currentTurnTeam = G.teams[ctx.currentPlayer];
  if (
    currentTurnTeam !== Team.A &&
    openedCard.some((card) => card.team === Team.MINE)
  ) {
    return true;
  }
  return false;
};
const isTeamBWinning = (G: CodenamesState, ctx: Ctx) => {
  const openedCard = G.cards.filter((card) => card.isOpen);
  if (
    openedCard.filter((card) => card.team === Team.B).length === cardNumOfTeamB
  ) {
    return true;
  }
  const currentTurnTeam = G.teams[ctx.currentPlayer];
  if (
    currentTurnTeam !== Team.B &&
    openedCard.some((card) => card.team === Team.MINE)
  ) {
    return true;
  }
  return false;
};

const assignTeamOfCards = (cards: Card[]) => {
  // [A, A, ..., A, B, B, ..., B, MINE, NO_SIDE, NO_SIDE, ..., NO_SIDE]のような配列を作る
  const teams: TeamType[] = new Array(cardNum)
    .fill(Team.A, 0, cardNumOfTeamA)
    .fill(Team.B, cardNumOfTeamA, cardNumOfTeamA + cardNumOfTeamB)
    .fill(
      Team.MINE,
      cardNumOfTeamA + cardNumOfTeamB,
      cardNumOfTeamA + cardNumOfTeamB + cardNumOfTeamMine,
    )
    .fill(Team.NO_SIDE, -cardNumOfTeamNoSide, -0);

  // シャッフル
  for (let i = teams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teams[i], teams[j]] = [teams[j], teams[i]];
  }

  // 各Cardにチームを割り当て
  for (let i = 0; i < cards.length; i++) {
    cards[i].team = teams[i];
  }
};

const findMaster = (G: CodenamesState, team: TeamType) => {
  const teams: string[] = Object.keys(G.teams).filter(
    (id) => G.teams[id] === team,
  );
  const masters: string[] = Object.keys(G.roles).filter(
    (id) => G.roles[id] === Role.Master,
  );
  return masters.filter((element) => teams.includes(element))[0];
};

const openAllCard = (G: CodenamesState) => {
  G.cards.forEach((card) => {
    card.isOpen = true;
  });
};

export const Codenames: Game<CodenamesState> = {
  name: "codenames",
  setup: () => {
    return initialGameState;
  },

  minPlayers: 1,
  maxPlayers: 4,

  moves: {
    endGuess: ({ events }) => {
      events.endTurn();
    },
    giveHint: ({ G, ctx, events }, hint: Hint) => {
      G.hint = hint;
      console.log(hint);
      const playerID = ctx.currentPlayer;
      const playerTeam = G.teams[playerID];

      const friendSpys: string[] = Object.keys(G.teams).filter(
        (id) => G.teams[id] === playerTeam && id !== playerID,
      ); // G.teamsからヒントを出したチームの味方スパイだけを抽出
      const activePlayerValue = Object.fromEntries(
        friendSpys.map((id) => [id, "select"]),
      ); // mapを使用してキーを[id, "select"]の形式に変換し、Object.fromEntriesでオブジェクトに変換
      events.setActivePlayers({
        value: activePlayerValue,
      });
    },
    openCard: ({ G, ctx, events }, id: number) => {
      const card = G.cards.find((c) => c.id == id);
      if (card) {
        if (card.isOpen) {
          return INVALID_MOVE;
        }
        card.isOpen = true;
      }

      // ゲームの終了条件を満たしていたらendフェーズに移行する
      if (isTeamAWinning(G, ctx) || isTeamBWinning(G, ctx)) {
        openAllCard(G);
        events.endPhase();
      }
    },
    setCards: ({ G }, words: string[]) => {
      for (let i = 0; i < G.cards.length; i++) {
        G.cards[i] = {
          id: i,
          word: words[i],
          team: Team.NO_SIDE,
          isOpen: false,
        };
      }
      assignTeamOfCards(G.cards);
    },
    resetCards: ({ G }) => {
      G.cards = Array.from({ length: cardNum }, (_, i) => getEmptyCard(i));
    },
    resetRolesAndTeams: ({ G }) => {
      G.roles = {};
      G.teams = {};
    },
    shuffleRolesAndTeams: ({ G, ctx, random }) => {
      const shuffledPlayers = random.Shuffle(ctx.playOrder);
      console.log(shuffledPlayers);

      // Assign Master for each team
      G.roles[shuffledPlayers[0]] = Role.Master;
      G.teams[shuffledPlayers[0]] = Team.A;
      G.roles[shuffledPlayers[1]] = Role.Master;
      G.teams[shuffledPlayers[1]] = Team.B;

      // All other players are Spy
      // Split the remaining players as evenly as possible between the two teams
      const remainingPlayers = shuffledPlayers.slice(2);

      for (const player of remainingPlayers) {
        G.roles[player] = Role.Spy;
      }

      const mid = Math.ceil(remainingPlayers.length / 2);
      const teamAPlayers = remainingPlayers.slice(0, mid);
      const teamBPlayers = remainingPlayers.slice(mid);

      for (const player of teamAPlayers) {
        G.teams[player] = Team.A;
      }

      for (const player of teamBPlayers) {
        G.teams[player] = Team.B;
      }
    },
    endSetup: ({ events }) => {
      events.endPhase();
    },
    nextGame: ({ G, events }) => {
      G.cards = initialGameState.cards;
      G.hint = initialGameState.hint;
      G.roles = initialGameState.roles;
      G.teams = initialGameState.teams;
      events.setPhase("setup");
    },
  },

  phases: {
    setup: {
      start: true,
      next: "main",
      turn: {
        order: {
          first: () => 0,
          next: () => 0,
        },
      },
    },
    main: {
      next: "end",
      turn: {
        order: {
          first: ({ G }) => {
            return Number(findMaster(G, Team.A));
          },
          next: ({ G, ctx }) => {
            const currentTurnTeam = G.teams[ctx.currentPlayer];
            if (currentTurnTeam === Team.A) {
              return Number(findMaster(G, Team.B));
            }
            if (currentTurnTeam === Team.B) {
              return Number(findMaster(G, Team.A));
            } else {
              return 0;
            }
          },
        },
      },
    },
    end: {
      next: "setup",
      turn: {
        order: {
          first: () => 0,
          next: () => 0,
        },
      },
    },
  },

  turn: {
    stages: {
      select: {},
    },
  },
};
