import Stack from "@mui/material/Stack";
import * as React from "react";

import { Card as CardModel } from "./Model";
import { Card as CardView } from "./Card";
import { cardNum } from "./Game";

interface CardsProps {
  cards: CardModel[];
  hidden?: boolean;
  onCardClick: (id: number) => void;
}

console.assert(cardNum === 25);

const Cards: React.FC<CardsProps> = (props) => {
  const { cards, hidden, onCardClick } = props;
  return (
    <Stack direction="column" spacing={2}>
      {Array.from({ length: 5 }, (_, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2}>
          {Array.from({ length: 5 }, (_, colIndex) => {
            const index = rowIndex * 5 + colIndex; // (rox,col==5,5)
            const { id, word, isOpen, team } = cards[index];
            return (
              <CardView
                key={id}
                id={id}
                word={word}
                hidden={hidden}
                isOpen={isOpen}
                team={team}
                onClick={onCardClick}
              />
            );
          })}
        </Stack>
      ))}
    </Stack>
  );
};

export default Cards;
