import { Button, FormControl } from "@mui/material";
import { LobbyAPI } from "boardgame.io";
import { SubmitHandler, useForm } from "react-hook-form";
import { LobbyRendererProps } from "./Lobby";

type FormValues = {
  gameName: string;
  playerCount: string;
};

const ListGamesView: React.FC<{ L: LobbyRendererProps }> = ({ L }) => {
  const gameNames = L.gameComponents.map((game) => game.game.name);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // TODO: プライベートルームの作成. lobbyClientを使ってunlisted=trueにする
    await L.handleCreateMatch(data.gameName, parseInt(data.playerCount));
  };

  return (
    <div className="p-2">
      <Button
        onClick={() => {
          L.handleExitLobby();
        }}
      >
        Leave Lobby
      </Button>

      <div className="w-full flex justify-center">
        <div className="flex-grow max-w-lg">
          <div className="text-center">Hi {L.playerName}!</div>
          <div className="flex justify-evenly gap-1 items-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                fullWidth
                variant="outlined"
                error={Boolean(errors.gameName)}
              >
                <label htmlFor="gameName">GameName:</label>
                <select
                  className="flex-grow"
                  id="gameNameSelect"
                  {...register("gameName", { required: true })}
                  onChange={(e) => setValue("gameName", e.target.value)}
                  defaultValue={"venns-code"}
                >
                  {gameNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <label htmlFor="playerCount">Players:</label>
                <select
                  className="flex-grow"
                  id="playerCountSelect"
                  {...register("playerCount", { required: true })}
                  onChange={(e) => setValue("playerCount", e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </FormControl>
              <Button type="submit" color="primary">
                Create Match
              </Button>
            </form>
          </div>

          <div className="text-lg">Join a Match</div>
          <MatchList L={L} />
        </div>
      </div>
    </div>
  );
};

const MatchButtons: React.FC<{
  L: LobbyRendererProps;
  match: LobbyAPI.Match;
  playerCount: number;
}> = ({ L, match, playerCount }) => {
  const playerSeat = match.players.find((p) => p.name === L.playerName); // 自分が着席しているところ
  const freeSeat = match.players.find((p) => !p.name); // 空席
  if (playerSeat && freeSeat) {
    // already seated: waiting for match to start
    return (
      <Button
        onClick={() => {
          L.handleLeaveMatch(match.gameName, match.matchID);
        }}
      >
        Leave
      </Button>
    );
  }
  if (freeSeat) {
    // at least 1 seat is available
    return (
      <Button
        onClick={() => {
          L.handleJoinMatch(match.gameName, match.matchID, "" + freeSeat.id);
        }}
      >
        Join
      </Button>
    );
  }
  // match is full
  if (playerSeat) {
    return (
      <>
        <Button
          onClick={() => {
            L.handleStartMatch(match.gameName, {
              numPlayers: playerCount,
              playerID: "" + playerSeat.id,
              matchID: match.matchID,
            });
          }}
        >
          Play
        </Button>
        <Button
          onClick={() => {
            L.handleLeaveMatch(match.gameName, match.matchID);
          }}
        >
          Leave
        </Button>
      </>
    );
  }
  // TODO: add spectate button
  return <div>Match In Progress...</div>;
};

const MatchList: React.FC<{ L: LobbyRendererProps }> = ({ L }) => {
  return (
    <div>
      {L.matches.map((match) => (
        <div
          className="flex gap-3 justify-between items-center border-b-2 border-black"
          key={match.matchID}
        >
          <div>{match.gameName}</div>
          <div>
            {match.players.map((player) => player.name ?? "[free]").join(", ")}
          </div>
          <MatchButtons
            L={L}
            match={match}
            playerCount={match.players.length}
          />
          <div>{new Date(match.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default ListGamesView;
