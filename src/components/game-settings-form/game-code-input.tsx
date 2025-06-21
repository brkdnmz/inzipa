import { Help } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  type TextFieldProps,
} from "@mui/material";

const TOOLTIP = `Haritalar rastgele oluşturuluyor.

Aynı oyun kodu, aynı boyutlarda hep aynı haritayı üretir. Bu sayede arkadaşlarınızla aynı haritada yarışabilirsiniz:)`;

type GameCodeInputProps = TextFieldProps;

export function GameCodeInput(props: GameCodeInputProps) {
  return (
    <TextField
      variant="outlined"
      label="Oyun Kodu"
      name="gameCode"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip
                title={TOOLTIP}
                placement="bottom-end"
                classes={{
                  tooltipPlacementBottom: "mt-2",
                  tooltip: "whitespace-pre-wrap bg-amber-700 max-w-40",
                }}
                enterTouchDelay={0}
                leaveTouchDelay={3000}
              >
                <IconButton edge="end" className="mr-0">
                  <Help className="text-amber-700" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
          className: "pr-0",
        },
      }}
      sx={{}}
      {...props}
    />
  );
}
