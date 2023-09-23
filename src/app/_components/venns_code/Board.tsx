import { Button, Container, Typography } from "@mui/material";
import { useState } from "react";
import ChartVenn from "./ChartVenn";
import HintInputForm from "./HintInputForm";
import { Roles, Sets, VennsCodeBoardProps } from "./Model";

export function VennsCodeBoard(props: VennsCodeBoardProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const [topics, setTopics] = useState<Record<Sets, string>>({
    a: "",
    b: "",
    c: "",
  });

  const { ctx, G, moves, playerID, matchData } = props;
  const isGM = G.roles[playerID || ""] === Roles.GM;

  const currentPlayerId = ctx.currentPlayer;
  const currentPlayerName = matchData.find(
    ({ id }) => id === Number(currentPlayerId),
  )?.name;

  // Handle the button click to shuffle roles and teams
  const handleShuffleClick = () => {
    moves.shuffleRolesAndTeams();
  };

  const handleTopicChange =
    (set: keyof typeof topics) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTopics({
        ...topics,
        [set]: event.target.value,
      });
    };

  // 役職やチームが割り当てられていないプレイヤーがいるか確認
  const playerIDs = matchData.map((item) => item.id.toString());
  const hasUnassignedPlayers = playerIDs.some(
    (pid) => !G.roles[pid] || !G.teams[pid],
  );

  const handleProvideHint = (hint: string) => {
    if (!playerID) {
      return;
    }
    if (!selectedRegion) {
      console.log("ヒントを出すエリアを指定してください");
      return;
    }
    const team = G.teams[playerID];
    moves.provideHint(team, selectedRegion!, hint);
    setSelectedRegion(null);
  };
  // const handleProvideHint = (hintRegion: string, hint: string) => {
  //   // ここでhintをゲームのステートに保存するmoves関数を呼び出す
  //   const hintTeam = playerID === "0" || playerID === "1" ? "A" : "B"; // 出題者のチームを決定
  //   if (!playerID) {
  //     return;
  //   }
  //   const team = G.teams[playerID];
  //   moves.provideHint(team, hintRegion, hint);
  // };

  const handleVennDiagramClick = (region: string) => {
    setSelectedRegion(region);
  };

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
        {isGM && ctx.phase === "assignTopicPhase" && (
          <div>
            {Object.keys(G.topics).map((setID) => (
              <div key={setID}>
                <input
                  type="text"
                  placeholder={`トピックを入力: ${setID}`}
                  onChange={(e) => handleTopicChange(setID as Sets)(e)}
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
          {ctx.phase === "setupPhase" && playerID === "0" && (
            <Button
              onClick={() => moves.endSetupPhase()}
              disabled={hasUnassignedPlayers}
            >
              Setup完了
            </Button>
          )}
          {ctx.phase === "assignTopicPhase" &&
            playerID &&
            G.roles[playerID] === Roles.GM && (
              <Button
                onClick={() => {
                  const topicKeys = Object.keys(topics) as Sets[];
                  for (const setID of topicKeys) {
                    moves.assignTopic(setID, topics[setID]);
                  }
                  moves.endAssignTopicPhase();
                }}
              >
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
              <div>
                現在のターン: チーム: {G.teams[currentPlayerId]}, ID:{" "}
                {ctx.currentPlayer}, {currentPlayerName}
              </div>
            )}
          </div>
        </Typography>
      </Container>
      <ChartVenn onClick={handleVennDiagramClick} />
      <HintInputForm onSubmit={handleProvideHint} />
    </Container>
  );
}

export default VennsCodeBoard;
