import type { BoardProps } from "boardgame.io/react";

export const Teams = {
  A: "A",
  B: "B",
  MINE: "MINE",
  NO_SIDE: "NO_SIDE",
} as const;

export type Teams = (typeof Teams)[keyof typeof Teams];

export const Roles = {
  Master: "Master",
  Spy: "Spy",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];

export interface CodenamesState {
  roles: {
    [playerID: string]: Roles;
  };
  teams: {
    [playerID: string]: Teams;
  };
}

export interface CodenamesBoardProps extends BoardProps<CodenamesState> {
  matchData: Array<{ id: number; name: string }>;
}
