import { Button, Container } from "@mui/material";
import { SetupViewProps } from "./Model";

export function SetupView(props: SetupViewProps) {
  const {
    onShuffleTeamAndRoleClick,
    onResetTeamAndRoleClick,
    onSetCardsClick,
    onResetCardsClick,
  } = props;
  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={onShuffleTeamAndRoleClick}
      >
        Shuffle Roles and Teams
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={onResetTeamAndRoleClick}
      >
        Reset Roles and Teams
      </Button>
      <Container>
        <Button onClick={onSetCardsClick}>Set Words</Button>
        <Button onClick={onResetCardsClick}>Reset Words</Button>
      </Container>
    </Container>
  );
}
