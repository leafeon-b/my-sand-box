import { useWords } from "@/app/_hooks/useWords";
import { Button, Container, List, ListItem, Typography } from "@mui/material";
import Cards from "./Cards";
import { cardNum } from "./Game";
import { CodenamesBoardProps, Hint, Role, Team } from "./Model";
import HintForm, { HintFormInputs } from "./HintForm";
import { SetupView } from "./SetupView";

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

  const playerTeam = playerID === null ? Team.NO_SIDE : G.teams[playerID];
  const currentPlayerId = ctx.currentPlayer;
  const currentPlayerName = matchData.find(
    ({ id }) => id === Number(currentPlayerId),
  )?.name;
  const activePlayers = ctx.activePlayers ?? {};
  const ActivePlayersListItems = Object.keys(activePlayers).map((playerID) => {
    return (
      <ListItem key={playerID}>
        {matchData.find((player) => player.id.toString() === playerID)?.name}:{" "}
        {activePlayers[playerID]}
      </ListItem>
    );
  });

  const isCardHidden = playerID === null || G.roles[playerID] !== Role.Master;

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

  const handleEndSetupClick = () => {
    moves.endSetup();
  };

  const handleCardClick = (id: number) => {
    moves.openCard(id);
  };

  const handleGiveHint = (data: HintFormInputs) => {
    const hint: Hint = {
      keyword: data.keyword,
      count: data.count,
      team: playerTeam,
    };
    moves.giveHint(hint);
  };

  const handleEndGuess = () => {
    moves.endGuess();
  };

  const setupViewEnabled = playerID === "0" && ctx.phase === "setup";

  return (
    <Container>
      {setupViewEnabled && (
        <SetupView
          onShuffleTeamAndRoleClick={handleShuffleClick}
          onResetTeamAndRoleClick={handleResetClick}
          onSetCardsClick={handleSetCardsClick}
          onResetCardsClick={handleResetCardsClick}
          onEndSetupClick={handleEndSetupClick}
        />
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
          <div>Active Players:</div>
          <List>{ActivePlayersListItems}</List>
        </Typography>
        <div className="inline-block text-lg italic shadow text-red-500 font-sans outline border-transparent border-2">
          {G.hint.keyword}, {G.hint.count}
        </div>
      </Container>
      <Cards
        cards={G.cards}
        hidden={isCardHidden}
        onCardClick={handleCardClick}
      />
      {currentPlayerId === playerID && G.roles[playerID] === Role.Master && (
        <HintForm onSubmit={handleGiveHint} />
      )}
      {playerID !== null && Object.keys(activePlayers).includes(playerID) && (
        <Button variant="contained" onClick={handleEndGuess}>
          推測を終了する
        </Button>
      )}
    </Container>
  );
}
