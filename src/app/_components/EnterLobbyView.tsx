import { Button } from "@mui/material";
import { useForm, FieldValues } from "react-hook-form";
import { LobbyRendererProps } from "./Lobby";

type FormValues = {
  name: string;
};

const EnterLobbyView: React.FC<{ L: LobbyRendererProps }> = ({ L }) => {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit = (data: FieldValues) => {
    console.log("data: ", data);
    L.handleEnterLobby(data.name);
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="text">Your Name</label>
            <input id="name" {...register("name", { required: true })} />
          </div>
          <Button>ログイン</Button>
        </form>
      </div>
    </div>
  );
};

export default EnterLobbyView;
