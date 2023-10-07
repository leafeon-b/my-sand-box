// Game.ts
import type { Game } from "boardgame.io";

export interface CodenamesState {
  cells: Array<string | null>;
}

export const Codenames: Game<CodenamesState> = {
  name: "codenames",

  minPlayers: 4,
  maxPlayers: 4,
};
