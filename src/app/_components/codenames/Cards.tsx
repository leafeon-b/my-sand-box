import * as React from "react";
import Stack from "@mui/material/Stack";
import useSWR, { Fetcher } from "swr";

import { Card } from "./Card";
import { Teams } from "./Model";

const DummyCard: React.FC<{ team: Teams }> = (props) => {
  const { team } = props;
  const fetcher: Fetcher<{ data: string[] }, string> = (...args) =>
    fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("/api/words", fetcher);
  if (error) {
    return <div>Failed to load</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }
  return <Card word={data.data[0]} isOpen={true} team={team} />;
};

const getRandomTeam = () => {
  const keys = Object.keys(Teams) as Array<keyof typeof Teams>;
  const randomIndex = Math.floor(Math.random() * keys.length);
  return Teams[keys[randomIndex]];
};

const Cards = () => {
  return (
    <Stack direction="column" spacing={2}>
      {Array.from({ length: 5 }, (_, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2}>
          {Array.from({ length: 5 }, (_, colIndex) => (
            <DummyCard key={colIndex + 1} team={getRandomTeam()} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

export default Cards;
