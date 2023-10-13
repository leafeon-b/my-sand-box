import { Button, Container, Typography } from "@mui/material";
import Cards from "./Cards";
import { CodenamesBoardProps } from "./Model";

export function CodenamesBoard(props: CodenamesBoardProps) {
  const { ctx, G, moves, playerID, matchData } = props;

  const currentPlayerId = ctx.currentPlayer;
  const currentPlayerName = matchData.find(
    ({ id }) => id === Number(currentPlayerId),
  )?.name;

  const handleShuffleClick = () => {
    moves.shuffleRolesAndTeams();
  };

  const handleResetClick = () => {
    moves.resetRolesAndTeams();
  };

  return (
    <Container>
      <h1>Codenames</h1>
      {playerID === "0" /* ゲームのホストが準備するためのコンポーネント */ && (
        <Container>
          <Button
            variant="contained"
            color="primary"
            onClick={handleShuffleClick}
          >
            Shuffle Roles and Teams
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetClick}
          >
            Reset Roles and Teams
          </Button>
        </Container>
      )}
      <Container>
        <h2>プレイヤーと役職・チーム</h2>
        {matchData.map((player) => (
          <div key={player.id}>
            {player.name} - {G.roles[player.id]} ({G.teams[player.id]})
          </div>
        ))}{" "}
      </Container>
      <Container>
        <Typography variant="h5" gutterBottom>
          <div>Current Phase: {ctx.phase}</div>
          <div>
            {ctx.phase === "mainPhase" && (
              <div>
                現在のターン: チーム: {G.teams[currentPlayerId]}, ID:{" "}
                {ctx.currentPlayer}, {currentPlayerName}
              </div>
            )}
          </div>
        </Typography>
      </Container>
      <Cards />
    </Container>
  );
}
