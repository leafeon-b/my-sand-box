import { useWords } from "@/app/_hooks/useWords";
import { Box, Button, Container, Grid } from "@mui/material";
import { LogEntry } from "boardgame.io";
import Cards from "./Cards";
import DebugView from "./DebugView";
import { cardNum } from "./Game";
import GameLogView from "./GameLogView";
import HintForm, { HintFormInputs } from "./HintForm";
import { CodenamesBoardProps, Hint, PlayersData, Role, Team } from "./Model";
import { SetupView } from "./SetupView";
import TeamCard from "./TeamCard";

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

function getCurrentGameLog(log: LogEntry[]): LogEntry[] {
  const condition = (l: LogEntry) =>
    l.action.type == "MAKE_MOVE" && l.action.payload.type === "nextGame";
  return findAndReturnRest(log, condition);
}

function findAndReturnRest<T>(
  list: T[],
  condition: (element: T) => boolean,
): T[] {
  // 条件を満たす最も末尾に近い要素のインデックスを見つけます。
  const index = findLastIndex(list, condition);

  // 見つかった要素以降のリストを返します。
  return list.slice(index);
}

function findLastIndex<T>(
  list: T[],
  condition: (element: T) => boolean,
): number {
  // 末尾から条件を満たす要素を探します。
  for (let i = list.length - 1; i >= 0; i--) {
    if (condition(list[i])) {
      return i;
    }
  }
  // 条件を満たす要素がない場合は0を返します。※通常のfindとは異なるので注意
  return 0;
}

export function CodenamesBoard(props: CodenamesBoardProps) {
  const { ctx, G, moves, playerID, matchData, events, log } = props;
  const { words } = useWords();

  const currentGameLog = getCurrentGameLog(log);

  const playersData: PlayersData = matchData!.map((match) => {
    const id = match.id;
    const name = match.name;
    const team = G.teams[id];
    const role = G.roles[id];
    return { id, name, team, role };
  });

  const playerTeam =
    playersData.find((player) => player.id.toString() === playerID)?.team ??
    Team.NO_SIDE;
  const currentPlayerId = ctx.currentPlayer;
  const activePlayers = ctx.activePlayers ?? {};
  const isCardHidden = playerID === null || G.roles[playerID] !== Role.Master;
  const hintColor =
    G.teams[currentPlayerId] == Team.A ? "text-red-500" : "text-blue-500";

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

  const handleCreateNextGameClick = async () => {
    moves.nextGame();
  };

  const setupViewEnabled = playerID === "0" && ctx.phase === "setup";

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <DebugView G={G} ctx={ctx} matchData={matchData} />
      <Container>
        <Button variant="contained" onClick={handleCreateNextGameClick}>
          次のゲーム
        </Button>
      </Container>
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TeamCard team={Team.A} playersData={playersData} />
          </Grid>
          <Grid item xs={6}>
            <TeamCard team={Team.B} playersData={playersData} />
          </Grid>
        </Grid>
      </Container>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {G.hint && (
            <div
              className={`inline-block text-lg italic shadow ${hintColor} font-sans outline border-transparent border-2`}
            >
              {G.hint.keyword}, {G.hint.count}
            </div>
          )}
          <Cards
            cards={G.cards}
            hidden={isCardHidden}
            onCardClick={handleCardClick}
          />
          {currentPlayerId === playerID &&
            G.roles[playerID] === Role.Master && (
              <HintForm onSubmit={handleGiveHint} />
            )}
          {playerID !== null &&
            Object.keys(activePlayers).includes(playerID) && (
              <Button variant="contained" onClick={handleEndGuess}>
                推測を終了する
              </Button>
            )}
        </Grid>
        <Grid item xs={6}>
          <GameLogView
            logs={currentGameLog}
            playersData={playersData}
            cards={G.cards}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
