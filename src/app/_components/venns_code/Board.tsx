import { Button, Container, Typography } from "@mui/material";
import type { BoardProps } from "boardgame.io/react";
import { Roles, Sets, Teams, VennsCodeState } from "./Game";

interface VennsCodeBoardProps extends BoardProps<VennsCodeState> {
  matchData: Array<{ id: number; name: string }>;
}

// const [topics, setTopics] = useState<{ a: string; b: string; c: string }>({
//   a: "",
//   b: "",
//   c: ""
// });

export function VennsCodeBoard(props: VennsCodeBoardProps) {
  const { ctx, G, moves, playerID, matchData } = props;
  const isGM = G.roles[playerID || ""] === Roles.GM;

  // Handle the button click to shuffle roles and teams
  const handleShuffleClick = () => {
    moves.shuffleRolesAndTeams();
  };

  // 役職やチームが割り当てられていないプレイヤーがいるか確認
  const playerIDs = matchData.map((item) => item.id.toString());
  const hasUnassignedPlayers = playerIDs.some(
    (pid) => !G.roles[pid] || !G.teams[pid],
  );

  return (
    <Container>
      <h1>Venn&#39;s Code</h1> {/* &#39;はアポストロフィ */}
      {ctx.phase === "setupPhase" &&
        playerID === "0" /* ホストが準備するためのコンポーネント */ && (
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
        {/* Display Player Names, Roles, and Teams */}
        <h2>プレイヤーと役職・チーム</h2>
        {matchData.map((player) => (
          <div key={player.id}>
            {player.name} - {G.roles[player.id]} ({G.teams[player.id]})
          </div>
        ))}{" "}
      </Container>
      <Container>
        {/* Display the topics (if assigned) */}
        <h2>トピック</h2>
        {Object.entries(G.topics).map(([setID, topic]) => (
          <div key={setID}>
            {setID}: {topic || "未割り当て"}
          </div>
        ))}
        {/* For GM: Assign topics */}
        {isGM && ctx.phase === "setup" && (
          <div>
            {Object.keys(G.topics).map((setID) => (
              <div key={setID}>
                <input
                  type="text"
                  placeholder={`トピックを入力: ${setID}`}
                  onChange={(e) =>
                    moves.assignTopic(setID as Sets, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}
        {/* Display hints */}
        <h2>ヒント</h2>
        {G.hints.map((hint, index) => (
          <div key={index}>
            {hint.team} チームのヒント: {hint.word} ({hint.region})
          </div>
        ))}

        {/* Display guesses */}
        <h2>推測</h2>
        {G.guesses.map((guess, index) => (
          <div key={index}>
            {guess.team} チームの推測: {guess.topicGuess} ({guess.setID})
          </div>
        ))}

        {/* Display score */}
        <h2>スコア</h2>
        <div>チーム A: {G.score.teamA} ポイント</div>
        <div>チーム B: {G.score.teamB} ポイント</div>
        <div>
          {ctx.phase === "setupPhase" && props.playerID === "0" && (
            <Button
              onClick={() => props.moves.endSetupPhase()}
              disabled={hasUnassignedPlayers}
            >
              Setup完了
            </Button>
          )}
          {ctx.phase === "assignTopicPhase" &&
            playerID &&
            G.roles[playerID] === Roles.GM && (
              <Button onClick={() => props.moves.endAssignTopicPhase()}>
                Topic割り当て完了
              </Button>
            )}
        </div>
      </Container>
      <Container>
        <Typography variant="h5" gutterBottom>
          <div>Current Phase: {ctx.phase}</div>
          <div>
            {ctx.phase === "mainPhase" && (
              <div>現在のターン: チーム {G.teams[ctx.currentPlayer]}</div>
            )}
          </div>
        </Typography>
      </Container>
    </Container>
  );
}

export default VennsCodeBoard;
