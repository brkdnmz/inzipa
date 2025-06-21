import { TextField, type TextFieldProps } from "@mui/material";

type GameCodeInputProps = TextFieldProps;

export function GameCodeInput(props: GameCodeInputProps) {
  return <TextField variant="outlined" label="Oyun Kodu" {...props} />;
}
