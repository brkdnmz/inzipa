import { Stack } from "@mui/material";
import { useCallback, useState } from "react";
import seedrandom from "seedrandom";
import { ButtonLink } from "../button-link";
import { GameCodeInput } from "./game-code-input";
import { GridSizeSelector } from "./grid-size-selector";
import { DEFAULT_SIZE, type AvailableGridSize } from "./grid-sizes";

export function GameSettingsForm() {
  const [gameCode, setGameCode] = useState<string>();
  const [selectedSize, setSelectedSize] =
    useState<AvailableGridSize>(DEFAULT_SIZE);

  const onPlay = useCallback(() => {
    seedrandom(gameCode, { global: true });
  }, [gameCode]);

  return (
    <Stack gap={3} className="max-w-3xs">
      <GameCodeInput
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
      />

      <GridSizeSelector size={selectedSize} onChange={setSelectedSize} />

      <ButtonLink
        variant="contained"
        size="large"
        to="/play"
        search={{
          rows: selectedSize[0],
          cols: selectedSize[1],
        }}
        onClick={onPlay}
      >
        Oyna
      </ButtonLink>
    </Stack>
  );
}
