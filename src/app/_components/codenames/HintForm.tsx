import { Button, Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  hint: string;
};

export default function HintForm() {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="ヒントを入力"
        defaultValue="test"
        {...register("hint", { required: true })}
      />
      <Button type="submit" variant="contained" endIcon={<SendIcon />} />
    </form>
  );
}
