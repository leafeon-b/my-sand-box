import { Button } from "@mui/material";
import { LobbyRendererProps } from "./Lobby";

const RunningMatchView: React.FC<{ L: LobbyRendererProps }> = ({ L }) => {
  return (
    <div>
      <div>Your name: {L.playerName}</div>
      <div>matchID: {L.runningMatch?.matchID}</div>
      <div>playerID: {L.runningMatch?.playerID}</div>
      <div>
        {L.runningMatch && (
          <L.runningMatch.app
            matchID={L.runningMatch.matchID}
            playerID={L.runningMatch.playerID}
            credentials={L.runningMatch.credentials}
          />
        )}
        <div className="absolute">
          <Button
            onClick={() => {
              L.handleExitMatch();
            }}
          >
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RunningMatchView;
