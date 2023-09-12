import type { BoardProps } from "boardgame.io/react";
import type { TicTacToe4State } from "./Game";
import { Button } from "@mui/material";

interface TicTacToe4Props extends BoardProps<TicTacToe4State> {}

export function TicTacToe4Board(props: TicTacToe4Props) {
  const { ctx, G, moves } = props;

  const onClick = (id: number) => moves.clickCell(id);

  let winner;
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">Winner: {ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  const cellStyle = {
    border: "1px solid #555",
    width: "50px",
    height: "50px",
    lineHeight: "50px",
  };

  const playerColor = (playerId: string | null) => {
    switch (playerId) {
      case "0":
        return "firebrick";
      case "1":
        return "aquamarine";
      case "2":
        return "lavender";
      default:
        return "";
    }
  };

  let tbody = [];
  for (let i = 0; i < 4; i++) {
    let cells = [];
    for (let j = 0; j < 4; j++) {
      const id = 4 * i + j;
      const bgColor = playerColor(G.cells[id]);
      cells.push(
        <td key={id}>
          {G.cells[id] ? (
            <div
              style={{
                ...cellStyle,
                textAlign: "center",
                backgroundColor: bgColor,
              }}
            >
              {G.cells[id]}
            </div>
          ) : (
            <Button
              style={{ ...cellStyle, textAlign: "center" }}
              onClick={() => onClick(id)}
            />
          )}
        </td>,
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  return (
    <div>
      <div>{ctx.currentPlayer}のターンです。</div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
  );
}
