import { Game } from "boardgame.io";
import { TurnOrder } from "boardgame.io/core";

export type VennsCodeState = {
  roles: {
    TeamAQuestioner: string | null;
    TeamAAnswerer: string | null;
    TeamBQuestioner: string | null;
    TeamBAnswerer: string | null;
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
      TeamAQuestioner: null,
      TeamAAnswerer: null,
      TeamBQuestioner: null,
      TeamBAnswerer: null,
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

          // Assign roles and teams based on the shuffled order
          G.roles.TeamAQuestioner = shuffledPlayers[0];
          G.roles.TeamAAnswerer = shuffledPlayers[1];
          G.roles.TeamBQuestioner = shuffledPlayers[2];
          G.roles.TeamBAnswerer = shuffledPlayers[3];

          G.teams.TeamA = [shuffledPlayers[0], shuffledPlayers[1]];
          G.teams.TeamB = [shuffledPlayers[2], shuffledPlayers[3]];
        },
      },
      endIf: ({ G }) =>
        G.roles.TeamAQuestioner !== null &&
        G.roles.TeamAAnswerer !== null &&
        G.roles.TeamBQuestioner !== null &&
        G.roles.TeamBAnswerer !== null,
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
