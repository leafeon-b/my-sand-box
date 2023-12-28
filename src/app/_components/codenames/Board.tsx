import { useWords } from "@/app/_hooks/useWords";
import { Button, Container, Typography } from "@mui/material";
import Cards from "./Cards";
import { cardNum } from "./Game";
import { CodenamesBoardProps, HintType, RoleValues, TeamValues } from "./Model";
import HintForm, { HintFormInputs } from "./HintForm";

// リストからランダムにn個の要素を抽出する関数
function getRandomElements<T>(list: T[], n: number): T[] {
  if (n >= list.length) {
    return [...list]; // リスト全体をコピーして返す
  }

  const shuffled = [...list]; // 元のリストをコピーしてシャッフル用に使用
  const result: T[] = [];

  // シャッフル
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 要素を入れ替える
  }

  // 先頭からn個を抽出
  for (let i = 0; i < n; i++) {
    result.push(shuffled[i]);
  }

  return result;
}

export function CodenamesBoard(props: CodenamesBoardProps) {
  const { ctx, G, moves, playerID, matchData } = props;
  const { words } = useWords();

  const playerTeam = playerID === null ? TeamValues.NO_SIDE : G.teams[playerID];
  const currentPlayerId = ctx.currentPlayer;
  const currentPlayerName = matchData.find(
    ({ id }) => id === Number(currentPlayerId),
  )?.name;

  const isCardHidden =
    playerID === null || G.roles[playerID] !== RoleValues.Master;

  const handleShuffleClick = () => {
    moves.shuffleRolesAndTeams();
  };

  const handleResetClick = () => {
    moves.resetRolesAndTeams();
  };

  const handleSetCardsClick = () => {
    if (!words) return;
    if (words.length < cardNum) {
      throw Error(`単語数が不足しています. ${cardNum}個必要です.`);
    }
    moves.setCards(getRandomElements(words, cardNum));
  };

  const handleResetCardsClick = () => {
    moves.resetCards();
  };

  const handleCardClick = (id: number) => {
    moves.openCard(id);
  };

  const handleGiveHint = (data: HintFormInputs) => {
    const hint: HintType = {
      keyword: data.keyword,
      count: data.count,
      team: playerTeam,
    };
    moves.giveHint(hint);
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
            {
              // {ctx.phase === "mainPhase" && (
              <div>
                現在のターン: チーム: {G.teams[currentPlayerId]}, ID:{" "}
                {ctx.currentPlayer}, {currentPlayerName}
              </div>
            }
          </div>
        </Typography>
        <div className="inline-block text-lg italic shadow text-red-500 font-sans outline border-transparent border-2">
          {G.hint}
        </div>
      </Container>
      <Cards
        cards={G.cards}
        hidden={isCardHidden}
        onCardClick={handleCardClick}
      />
      {currentPlayerId === playerID &&
        G.roles[playerID] === RoleValues.Master && (
          <HintForm onSubmit={handleGiveHint} />
        )}
      <Container>
        <Button onClick={handleSetCardsClick}>Set Words</Button>
        <Button onClick={handleResetCardsClick}>Reset Words</Button>
      </Container>
    </Container>
  );
}
