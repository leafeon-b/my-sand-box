// Game.ts
import type { Game } from "boardgame.io";
import { CodenamesState, Roles, Teams } from "./Model";

export const Codenames: Game<CodenamesState> = {
  name: "codenames",
  setup: () => {
    const roles: { [playerID: string]: Roles } = {};
    const teams: { [playerID: string]: Teams } = {};

    return {
      roles,
      teams,
    };
  },

  minPlayers: 4,
  maxPlayers: 4,

  moves: {
    resetRolesAndTeams: ({ G, ctx, random }) => {
      G.roles = {};
      G.teams = {};
    },
    shuffleRolesAndTeams: ({ G, ctx, random }) => {
      const shuffledPlayers = random.Shuffle(ctx.playOrder);
      console.log(shuffledPlayers);

      // Assign Master for each team
      G.roles[shuffledPlayers[0]] = Roles.Master;
      G.teams[shuffledPlayers[0]] = Teams.A;
      G.roles[shuffledPlayers[1]] = Roles.Master;
      G.teams[shuffledPlayers[1]] = Teams.B;

      // All other players are Spy
      // Split the remaining players as evenly as possible between the two teams
      const remainingPlayers = shuffledPlayers.slice(2);

      for (const player of remainingPlayers) {
        G.roles[player] = Roles.Spy;
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
};
