import { List, ListItem, Paper, Typography } from "@mui/material";
import { LogEntry } from "boardgame.io";
import { Card, Hint, PlayerData, PlayersData, Team, TeamType } from "./Model";

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

  const coloredPlayerName = (player?: PlayerData) => {
    if (player === undefined) return;
    const playerColor = player.team == Team.A ? "red" : "blue";
    return (
      <span style={{ color: playerColor, fontWeight: "bold" }}>
        {player.name}
      </span>
    );
  };

  const coloredCardWord = (card?: Card) => {
    if (card === undefined) return;
    const colorMap = new Map<TeamType, string>([
      [Team.A, "red"],
      [Team.B, "blue"],
      [Team.MINE, "#555555"],
      [Team.NO_SIDE, "rgb(173, 140, 109)"],
    ]);
    return (
      <span style={{ color: colorMap.get(card.team), fontWeight: "bold" }}>
        {card.word}
      </span>
    );
  };

  const logItem = (log: LogEntry) => {
    const playerID = log.action.payload.playerID;
    const player = playersData.find((p) => p.id.toString() === playerID);
    const args = log.action.payload.args;
    switch (log.action.payload.type) {
      case "openCard":
        const cardID = args[0] as number;
        const card = cards.find((c) => c.id === cardID);
        return (
          <Typography>
            {coloredPlayerName(player)} が選択: {coloredCardWord(card)}
          </Typography>
        );
      case "giveHint":
        const hint = args[0] as Hint;
        return (
          <Typography>
            {coloredPlayerName(player)} のヒント: {hint.keyword} {hint.count}
          </Typography>
        );
      case "endGuess":
        return (
          <Typography>{coloredPlayerName(player)} が推測を終了</Typography>
        );
      default:
        return;
    }
  };

  console.log("log: ", logs);
  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: 360,
        height: 540,
        overflow: "auto",
        backgroundColor: "lavender",
      }}
    >
      <Typography sx={{ textAlign: "center" }}>ゲームログ</Typography>
      <List>
        {openCardLogs.map((log) => {
          return <ListItem key={log._stateID}>{logItem(log)}</ListItem>;
        })}
      </List>
    </Paper>
  );
}
