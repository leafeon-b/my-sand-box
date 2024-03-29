// Game.ts
import type { Game } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

export interface TicTacToeState {
  cells: Array<string | null>;
}

function isVictory(cells: Array<string | null>) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row: Array<number>) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells: TicTacToeState["cells"]) {
  return cells.filter((c) => c === null).length === 0;
}
// const move: Move<MyGameState> = ({ G, ctx }) => {};

export const TicTacToe: Game<TicTacToeState> = {
  name: "tic-tac-toe",

  minPlayers: 2,
  maxPlayers: 2,

  setup: () => ({ cells: Array(9).fill(null) }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    clickCell: ({ G, playerID }, id) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = playerID;
    },
  },

  endIf: ({ G, ctx }) => {
    if (isVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },

  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: "clickCell", args: [i] });
        }
      }
      return moves;
    },
  },
};
