import { List, ListItem, Paper } from "@mui/material";
import { LogEntry } from "boardgame.io";
import { Card, Hint, PlayersData } from "./Model";

export interface GameLogViewProps {
  logs: LogEntry[];
  playersData: PlayersData;
  cards: Card[];
}

const actionTypeToDisplay = ["openCard", "giveHint", "endGuess"];

export default function GameLogView(props: GameLogViewProps) {
  const { logs, playersData, cards } = props;
  const mainLogs = logs.filter((log) => log.phase === "main");
  const openCardLogs = mainLogs.filter(
    (log) =>
      log.action.type === "MAKE_MOVE" &&
      actionTypeToDisplay.includes(log.action.payload.type),
  );

  const stringify = (log: LogEntry) => {
    const playerID = log.action.payload.playerID;
    const player = playersData.find((p) => p.id.toString() === playerID);
    const args = log.action.payload.args;
    switch (log.action.payload.type) {
      case "openCard":
        const cardID = args[0] as number;
        const card = cards.find((c) => c.id === cardID);
        return `${player?.name}(${player?.team}) が選択: ${card?.word}(${card?.team})`;
      case "giveHint":
        const hint = args[0] as Hint;
        return `${player?.name}(${player?.team}) がヒントを出す: ${hint.keyword} ${hint.count}`;
      case "endGuess":
        return `${player?.name}(${player?.team}) が推測を終了`;
      default:
        return "";
    }
  };

  console.log("log: ", logs);
  return (
    <Paper>
      ゲームログ
      <List>
        {openCardLogs.map((log) => {
          return <ListItem key={log._stateID}>{stringify(log)}</ListItem>;
        })}
      </List>
    </Paper>
  );
}
