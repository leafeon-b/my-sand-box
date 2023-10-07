import type { BoardProps } from "boardgame.io/react";
import type { CodenamesState } from "./Game";

interface CodenamesProps extends BoardProps<CodenamesState> {}

export function CodenamesBoard(props: CodenamesProps) {
  const { ctx, G, moves } = props;

  return (
    <div>
      <div>{ctx.currentPlayer}のターンです。</div>
    </div>
  );
}
