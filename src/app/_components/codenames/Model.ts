import type { BoardProps } from "boardgame.io/react";

export const Team = {
  A: "A",
  B: "B",
  MINE: "MINE",
  NO_SIDE: "NO_SIDE",
} as const;

export type TeamType = (typeof Team)[keyof typeof Team];

export const Role = {
  Master: "Master",
  Spy: "Spy",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export interface Card {
  id: number;
  word: string;
  team: TeamType;
  isOpen: boolean;
}

export interface Hint {
  keyword: string;
  count: number;
  team: TeamType;
}

export type PlayerData = {
  id: number;
  name?: string;
  team: TeamType;
  role: RoleType;
};

export type PlayersData = PlayerData[];

export interface CodenamesState {
  roles: {
    [playerID: string]: RoleType;
  };
  teams: {
    [playerID: string]: TeamType;
  };
  cards: Card[];
  hint?: Hint;
}

export interface CodenamesBoardProps extends BoardProps<CodenamesState> {}

export interface SetupViewProps {
  onShuffleTeamAndRoleClick: () => void;
  onResetTeamAndRoleClick: () => void;
  onSetCardsClick: () => void;
  onResetCardsClick: () => void;
  onEndSetupClick: () => void;
}
