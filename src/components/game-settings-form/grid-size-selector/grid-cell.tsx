import { theme } from "@/theme";
import { Box, Grid } from "@mui/material";
import clsx from "clsx";
import type { AvailableGridSize, SIZES } from "../grid-sizes";

type GridCellProps = {
  rowSize: (typeof SIZES)[number];
  colSize: (typeof SIZES)[number];
  selectedSize: AvailableGridSize;
  onClick: (size: AvailableGridSize) => void;
};

export function GridCell({
  rowSize,
  colSize,
  selectedSize,
  onClick,
}: GridCellProps) {
  return (
    <Grid key={colSize} size={1} className="flex items-center justify-center">
      <Box
        className={clsx(
          "box-border aspect-square w-full cursor-pointer rounded-sm border-2 opacity-50 transition hover:scale-120",
          rowSize <= selectedSize[0] &&
            colSize <= selectedSize[1] &&
            "scale-100 border-4 opacity-100",
        )}
        sx={{
          borderColor: theme.palette.primary.main,
        }}
        onClick={() => onClick([rowSize, colSize])}
      />
    </Grid>
  );
}
