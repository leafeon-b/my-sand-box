"use client";

import { Lobby } from "boardgame.io/react";
import { TicTacToeBoard } from "./tic_tac_toe/Board";
import { TicTacToe } from "./tic_tac_toe/Game";
import { TicTacToe4Board } from "./tic_tac_toe_4/Board";
import { TicTacToe4 } from "./tic_tac_toe_4/Game";

interface MyLobbyProps {}

const server = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
console.log("server: ", server);

export const MyLobby: React.FC<MyLobbyProps> = () => {
  return (
    <Lobby
      gameServer={server}
      lobbyServer={server}
      gameComponents={[
        { game: TicTacToe, board: TicTacToeBoard },
        { game: TicTacToe4, board: TicTacToe4Board },
      ]}
    />
  );
};
