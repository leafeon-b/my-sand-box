import SendIcon from "@mui/icons-material/Send";
import { Button, FormControl, Input, MenuItem, Select } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

export type HintFormInputs = {
  keyword: string;
  count: number;
};

export interface HintFormProps {
  onSubmit: SubmitHandler<HintFormInputs>;
}

export default function HintForm(props: HintFormProps) {
  const { onSubmit } = props;
  const { register, handleSubmit } = useForm<HintFormInputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="ヒントを入力"
        defaultValue="test"
        {...register("keyword", { required: true })}
      />
      <FormControl>
        <Select defaultValue={0} {...register("count", { required: true })}>
          <MenuItem value={0}>0</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>∞</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" endIcon={<SendIcon />} />
    </form>
  );
}
