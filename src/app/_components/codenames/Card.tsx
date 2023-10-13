import { Button } from "@mui/material";
import { Teams } from "./Model";

export interface CardProps {
  word: string;
  isOpen: boolean;
  team: Teams;
}

export function Card(props: CardProps) {
  const { word, isOpen, team } = props;
  const color = (() => {
    const defaultColor = "#ffffe0";
    if (!isOpen) return defaultColor;
    switch (team) {
      case Teams.A:
        return "#dc143c";
      case Teams.B:
        return "#4169e1";
      case Teams.MINE:
        return "#555555";
      case Teams.NO_SIDE:
      default:
        return defaultColor;
    }
  })();
  const style = {
    backgroundColor: color,
    color: "black",
  };
  // return <Button variant="outlined" style={{color: color}}>{word}</Button>;
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: color, color: "black" }}
    >
      {word}
    </Button>
  );
}
