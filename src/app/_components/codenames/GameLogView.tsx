import { List, ListItem } from "@mui/material";
import { LogEntry } from "boardgame.io";
import { Card, PlayersData } from "./Model";

export interface GameLogViewProps {
  logs: LogEntry[];
  playersData: PlayersData;
  cards: Card[];
}

export default function GameLogView(props: GameLogViewProps) {
  const { logs, playersData, cards } = props;
  const mainLogs = logs.filter((log) => log.phase === "main");
  const openCardLogs = mainLogs.filter(
    (log) =>
      log.action.type === "MAKE_MOVE" && log.action.payload.type === "openCard",
  );
  console.log("log: ", logs);
  return (
    <List>
      {openCardLogs.map((log) => {
        const playerID = log.action.payload.playerID;
        const player = playersData.find((p) => p.id.toString() === playerID);
        const cardID = log.action.payload.args[0];
        const card = cards.find((c) => c.id === cardID);
        return (
          <ListItem key={log._stateID}>
            {player?.name}({player?.team}) guesses {card?.word}({card?.team})
          </ListItem>
        );
      })}
    </List>
  );
}
