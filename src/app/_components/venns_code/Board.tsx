import { Button, Typography, Container, Paper, Grid } from "@mui/material";
import { VennsCodeState } from "./Game";
import React from "react";
import type { BoardProps } from "boardgame.io/react";

interface VennsCodeBoardProps extends BoardProps<VennsCodeState> {
  matchData: Array<{ id: number; name: string }>;
}

export function VennsCodeBoard(props: VennsCodeBoardProps) {
  const { ctx, G, moves, playerID, matchData } = props;

  const getPlayerNameById = (id: number) => {
    const player = matchData.find((p) => p.id === id);
    return player ? player.name : id.toString();
  };

  // Handle the button click to shuffle roles and teams
  const handleShuffleClick = () => {
    moves.shuffleRolesAndTeams();
  };

  return (
    <Container>
      {ctx.phase === "setupPhase" && playerID === "0" && (
        <Container>
          <Button
            variant="contained"
            color="primary"
            onClick={handleShuffleClick}
          >
            Shuffle Roles and Teams
          </Button>
        </Container>
      )}
      {/* Display roles and teams after shuffling */}
      <Container>
        <Typography variant="h5" gutterBottom>
          Roles:
        </Typography>
        <Typography variant="body1">
          GM: {getPlayerNameById(Number(G.roles.GM))}
        </Typography>
        <Typography variant="body1">
          Team A 出題者: {getPlayerNameById(Number(G.roles.TeamAQuestioner))}
        </Typography>
        <Typography variant="body1">
          Team A 回答者:{" "}
          {G.teams.TeamA.slice(1)
            .map((id) => getPlayerNameById(Number(id)))
            .join(", ")}
        </Typography>
        <Typography variant="body1">
          Team B 出題者: {getPlayerNameById(Number(G.roles.TeamBQuestioner))}
        </Typography>
        <Typography variant="body1">
          Team B 回答者:{" "}
          {G.teams.TeamB.slice(1)
            .map((id) => getPlayerNameById(Number(id)))
            .join(", ")}
        </Typography>
      </Container>
      <Container>
        <Typography variant="h5" gutterBottom>
          Teams:
        </Typography>
        <Typography variant="body1">
          Team A:{" "}
          {G.teams.TeamA.map((id) => getPlayerNameById(Number(id))).join(", ")}
        </Typography>
        <Typography variant="body1">
          Team B:{" "}
          {G.teams.TeamB.map((id) => getPlayerNameById(Number(id))).join(", ")}
        </Typography>
      </Container>
      <Container>
        <Typography variant="h5" gutterBottom>
          Current Phase:
        </Typography>
        <Typography variant="body1">{ctx.phase}</Typography>
      </Container>
    </Container>
  );
}

export default VennsCodeBoard;
