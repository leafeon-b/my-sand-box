import { Button, Container, Typography } from "@mui/material";
import { CodenamesBoardProps, RoleValues } from "./Model";
import { useWords } from "@/app/_hooks/useWords";
import Cards from "./Cards";
import { cardNum } from "./Game";

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
      </Container>
      <Cards
        cards={G.cards}
        hidden={isCardHidden}
        onCardClick={handleCardClick}
      />
      <Container>
        <Button onClick={handleSetCardsClick}>Set Words</Button>
        <Button onClick={handleResetCardsClick}>Reset Words</Button>
      </Container>
    </Container>
  );
}
