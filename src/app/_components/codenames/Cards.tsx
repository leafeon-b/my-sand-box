import Stack from "@mui/material/Stack";
import * as React from "react";

import { Card as CardModel } from "./Model";
import { Card } from "./Card";
import { cardNum } from "./Game";

interface CardsProps {
  cards: CardModel[];
}

console.assert(cardNum === 25);

const Cards: React.FC<CardsProps> = (props) => {
  const { cards } = props;
  return (
    <Stack direction="column" spacing={2}>
      {Array.from({ length: 5 }, (_, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2}>
          {Array.from({ length: 5 }, (_, colIndex) => {
            const index = rowIndex * 5 + colIndex; // (rox,col==5,5)
            const { word, isOpen, team } = cards[index];
            return <Card key={index} word={word} isOpen={isOpen} team={team} />;
          })}
        </Stack>
      ))}
    </Stack>
  );
};

export default Cards;
