import { Grid } from "@mui/material";
import type { SIZES } from "../grid-sizes";

type HeaderItemProps = {
  size: (typeof SIZES)[number];
};

export function HeaderItem({ size }: HeaderItemProps) {
  return (
    <Grid
      key={size}
      flex={1}
      className="flex items-center justify-center font-mono"
    >
      {size}
    </Grid>
  );
}
