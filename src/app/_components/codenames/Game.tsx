import type { Game } from "boardgame.io";
import {
  Card,
  CodenamesState,
  RoleValues,
  Roles,
  Teams,
  TeamValues,
} from "./Model";

export const cardNum = 25;
export const cardNumOfTeamA = 9;
export const cardNumOfTeamB = 8;
export const cardNumOfTeamMine = 1;
export const cardNumOfTeamNoSide = 7;

const getEmptyCard: () => Card = () => ({
  word: "",
  team: TeamValues.NO_SIDE,
  isOpen: true,
});

const assignTeamOfCards = (cards: Card[]) => {
  // [A, A, ..., A, B, B, ..., B, MINE, NO_SIDE, NO_SIDE, ..., NO_SIDE]のような配列を作る
  const teams: Teams[] = new Array(cardNum)
    .fill(TeamValues.A, 0, cardNumOfTeamA)
    .fill(TeamValues.B, cardNumOfTeamA, cardNumOfTeamA + cardNumOfTeamB)
    .fill(
      TeamValues.MINE,
      cardNumOfTeamA + cardNumOfTeamB,
      cardNumOfTeamA + cardNumOfTeamB + cardNumOfTeamMine,
    )
    .fill(TeamValues.NO_SIDE, -cardNumOfTeamNoSide, -0);

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

export const Codenames: Game<CodenamesState> = {
  name: "codenames",
  setup: () => {
    const roles: { [playerID: string]: Roles } = {};
    const teams: { [playerID: string]: Teams } = {};
    const cards: Card[] = Array.from({ length: cardNum }, (_, i) =>
      getEmptyCard(),
    );

    return {
      roles,
      teams,
      cards,
    };
  },

  minPlayers: 4,
  maxPlayers: 4,

  moves: {
    setCards: ({ G }, words: string[]) => {
      for (let i = 0; i < G.cards.length; i++) {
        G.cards[i] = {
          word: words[i],
          team: TeamValues.NO_SIDE,
          isOpen: true,
        };
      }
      assignTeamOfCards(G.cards);
    },
    resetCards: ({ G }) => {
      G.cards = Array.from({ length: cardNum }, (_, i) => getEmptyCard());
    },
    resetRolesAndTeams: ({ G }) => {
      G.roles = {};
      G.teams = {};
    },
    shuffleRolesAndTeams: ({ G, ctx, random }) => {
      const shuffledPlayers = random.Shuffle(ctx.playOrder);
      console.log(shuffledPlayers);

      // Assign Master for each team
      G.roles[shuffledPlayers[0]] = RoleValues.Master;
      G.teams[shuffledPlayers[0]] = TeamValues.A;
      G.roles[shuffledPlayers[1]] = RoleValues.Master;
      G.teams[shuffledPlayers[1]] = TeamValues.B;

      // All other players are Spy
      // Split the remaining players as evenly as possible between the two teams
      const remainingPlayers = shuffledPlayers.slice(2);

      for (const player of remainingPlayers) {
        G.roles[player] = RoleValues.Spy;
      }

      const mid = Math.ceil(remainingPlayers.length / 2);
      const teamAPlayers = remainingPlayers.slice(0, mid);
      const teamBPlayers = remainingPlayers.slice(mid);

      for (const player of teamAPlayers) {
        G.teams[player] = TeamValues.A;
      }

      for (const player of teamBPlayers) {
        G.teams[player] = TeamValues.B;
      }
    },
  },
};
