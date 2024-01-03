import { Card, CardContent, List, ListItem, Typography } from "@mui/material";
import { PlayersData, Role, Team, TeamType } from "./Model";

export interface TeamCardProps {
  team: TeamType;
  playersData: PlayersData;
}

const backgroundColorForTeam = (team: TeamType) => {
  if (team === Team.A) {
    return "crimson";
  }
  if (team === Team.B) {
    return "royalblue";
  }
};

export default function TeamCard(props: TeamCardProps) {
  const { team, playersData } = props;
  const teamPlayersData = playersData.filter((player) => player.team === team);
  const operatives = teamPlayersData.filter(
    (player) => player.role === Role.Spy,
  );
  const master = teamPlayersData.find((player) => player.role === Role.Master);
  const backgroundColor = backgroundColorForTeam(team);
  return (
    <Card
      sx={{
        backgroundColor: backgroundColor,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography
          color={"whitesmoke"}
          sx={{
            opacity: 0.5,
          }}
        >
          諜報員
        </Typography>
        <List>
          {operatives.map((operative) => {
            return (
              <ListItem key={operative.id}>
                <Typography color={"whitesmoke"}>{operative.name}</Typography>
              </ListItem>
            );
          })}
        </List>
        <Typography
          color={"whitesmoke"}
          sx={{
            opacity: 0.5,
          }}
        >
          スパイマスター
        </Typography>
        <Typography color={"whitesmoke"}>{master?.name}</Typography>
      </CardContent>
    </Card>
  );
}
