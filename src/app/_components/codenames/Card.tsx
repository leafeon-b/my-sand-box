import { Button } from "@mui/material";
import { Teams, TeamValues } from "./Model";

export interface CardProps {
  word: string;
  isOpen: boolean;
  team: Teams;
}

export function Card(props: CardProps) {
  const { word, isOpen, team } = props;
  const color = (() => {
    const defaultColor = "#ffffe0";
    if (!isOpen) return "#eaffea";
    switch (team) {
      case TeamValues.A:
        return "#dc143c";
      case TeamValues.B:
        return "#4169e1";
      case TeamValues.MINE:
        return "#555555";
      case TeamValues.NO_SIDE:
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
      style={{
        backgroundColor: color,
        color: "black",
        width: "150px",
        height: "60px",
      }}
    >
      {word}
    </Button>
  );
}
