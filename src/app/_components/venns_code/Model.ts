export const Teams = {
  A: "A",
  B: "B",
  GM: "GM",
} as const;

export type Teams = (typeof Teams)[keyof typeof Teams];

export const Roles = {
  Questioner: "Questioner",
  Answerer: "Answerer",
  GM: "GM",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];

export const Sets = {
  A: "a",
  B: "b",
  C: "c",
} as const;

export type Sets = (typeof Sets)[keyof typeof Sets];

export interface Guess {
  team: Teams;
  setID: Sets;
  topicGuess: string;
}

export interface Hint {
  team: Teams;
  region: string;
  word: string;
}

export interface VennsCodeState {
  topics: {
    [key in Sets]?: string;
  };
  roles: {
    [playerID: string]: Roles;
  };
  teams: {
    [playerID: string]: Teams;
  };
  hints: Array<Hint>;
  guesses: Array<Guess>;
  score: {
    teamA: number;
    teamB: number;
  };
}
