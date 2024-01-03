import { List, ListItem } from "@mui/material";
import { Ctx, FilteredMetadata } from "boardgame.io";
import { CodenamesState } from "./Model";

export interface DebugViewProps {
  G: CodenamesState;
  ctx: Ctx;
  matchData: FilteredMetadata | undefined;
}

export default function DebugView(props: DebugViewProps) {
  const { G, ctx, matchData } = props;
  const activePlayers = ctx.activePlayers ?? {};
  const currentPlayerId = ctx.currentPlayer;
  const currentPlayerName = matchData?.find(
    ({ id }) => id === Number(currentPlayerId),
  )?.name;

  return (
    <>
      <div>Current Phase: {ctx.phase}</div>
      <div>
        {
          <div>
            現在のターン: チーム: {G.teams[currentPlayerId]}, ID:{" "}
            {ctx.currentPlayer}, {currentPlayerName}
          </div>
        }
      </div>
      <div>Active Players:</div>
      <List>
        {Object.keys(activePlayers).map((playerID) => {
          return (
            <ListItem key={playerID}>
              {
                matchData?.find((player) => player.id.toString() === playerID)
                  ?.name
              }
              : {activePlayers[playerID]}
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
