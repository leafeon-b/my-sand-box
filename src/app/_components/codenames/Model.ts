import type { BoardProps } from "boardgame.io/react";

export const TeamValues = {
  A: "A",
  B: "B",
  MINE: "MINE",
  NO_SIDE: "NO_SIDE",
} as const;

export type Teams = (typeof TeamValues)[keyof typeof TeamValues];

export const RoleValues = {
  Master: "Master",
  Spy: "Spy",
} as const;

export type Roles = (typeof RoleValues)[keyof typeof RoleValues];

export interface CardType {
  id: number;
  word: string;
  team: Teams;
  isOpen: boolean;
}

export interface HintType {
  keyword: string;
  count: number;
  team: Teams;
}

export interface CodenamesState {
  roles: {
    [playerID: string]: Roles;
  };
  teams: {
    [playerID: string]: Teams;
  };
  cards: CardType[];
  hint: HintType;
}

export interface CodenamesBoardProps extends BoardProps<CodenamesState> {
  matchData: Array<{ id: number; name: string }>;
}
