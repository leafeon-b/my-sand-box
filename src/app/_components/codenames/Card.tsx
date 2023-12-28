import { Button } from "@mui/material";
import { TeamType, Team } from "./Model";

export interface CardProps {
  id: number;
  word: string;
  hidden?: boolean;
  isOpen: boolean;
  team: TeamType;
  onClick: (is: number) => void;
}

export function Card(props: CardProps) {
  const { id, word, hidden, isOpen, team } = props;
  const color = (() => {
    const defaultColor = "#ffffe0";
    if (!isOpen && hidden) return "#eaffea";
    switch (team) {
      case Team.A:
        return "#dc143c";
      case Team.B:
        return "#4169e1";
      case Team.MINE:
        return "#555555";
      case Team.NO_SIDE:
      default:
        return defaultColor;
    }
  })();
  const style = {
    backgroundColor: color,
    color: "black",
  };
  return (
    <Button
      value={id}
      onClick={() => props.onClick(id)}
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
