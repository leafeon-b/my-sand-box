"use client";

import { LobbyClient } from "boardgame.io/client";
import { Lobby } from "boardgame.io/react";
import EnterLobbyView from "./EnterLobbyView";
import ListGamesView from "./ListGamesView";
import { TicTacToeBoard } from "./tic_tac_toe/Board";
import { TicTacToe } from "./tic_tac_toe/Game";
import { TicTacToe4Board } from "./tic_tac_toe_4/Board";
import { TicTacToe4 } from "./tic_tac_toe_4/Game";
import RunningMatchView from "./RunningMatchView";
import VennsCode from "./venns_code/Game";
import VennsCodeBoard from "./venns_code/Board";

enum LobbyPhases {
  ENTER = "enter",
  LIST = "list",
  PLAY = "play",
}

interface MyLobbyProps {}

const server = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

export const MyLobby: React.FC<MyLobbyProps> = () => {
  return (
    <Lobby
      gameServer={server}
      lobbyServer={server}
      gameComponents={[
        { game: TicTacToe, board: TicTacToeBoard },
        { game: TicTacToe4, board: TicTacToe4Board },
        { game: VennsCode, board: VennsCodeBoard },
      ]}
      renderer={(L) => {
        return (
          <div>
            {L.phase === LobbyPhases.ENTER && <EnterLobbyView L={L} />}
            {L.phase === LobbyPhases.LIST && <ListGamesView L={L} />}
            {L.phase === LobbyPhases.PLAY && <RunningMatchView L={L} />}
          </div>
        );
      }}
    />
  );
};

// LobbyRendererProps の型定義
// 1. `InstanceType<typeof Lobby>`: Lobby のインスタンスの型を取得します。
// 2. `['props']['renderer']`: Lobby インスタンスの `props` の中の `renderer` の型を取得します。
// 3. `NonNullable<T>`: 型 T から null および undefined を排除します。これにより、renderer がオプショナルの場合も対応します。
// 4. `Parameters<T>`: 関数型 T のパラメータの型をタプルとして取得します。
// 5. `[0]`: タプルの最初の要素（renderer の引数の型）を取得します。
export type LobbyRendererProps = Parameters<
  NonNullable<InstanceType<typeof Lobby>["props"]["renderer"]>
>[0];

export const lobbyClient = new LobbyClient({ server: server });
