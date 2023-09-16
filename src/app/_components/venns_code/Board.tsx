import { Button, Typography, Container, Paper, Grid } from "@mui/material";
import { VennsCodeState } from "./Game";
import React from "react";
import type { BoardProps as BGIOBoardProps } from "boardgame.io/react";

interface VennsCodeBoardProps extends BGIOBoardProps<VennsCodeState> {}

export function VennsCodeBoard(props: VennsCodeBoardProps) {
  const { ctx, G, moves, playerID } = props;

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
        <Typography variant="body1">GM: {G.roles.GM}</Typography>
        <Typography variant="body1">
          Team A 出題者: {G.roles.TeamAQuestioner}
        </Typography>
        <Typography variant="body1">
          Team A 回答者: {G.teams.TeamA.slice(1).join(", ")}
        </Typography>
        <Typography variant="body1">
          Team B 出題者: {G.roles.TeamBQuestioner}
        </Typography>
        <Typography variant="body1">
          Team B 回答者: {G.teams.TeamB.slice(1).join(", ")}
        </Typography>
      </Container>
      <Container>
        <Typography variant="h5" gutterBottom>
          Teams:
        </Typography>
        <Typography variant="body1">
          Team A: {G.teams.TeamA.join(", ")}
        </Typography>
        <Typography variant="body1">
          Team B: {G.teams.TeamB.join(", ")}
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
