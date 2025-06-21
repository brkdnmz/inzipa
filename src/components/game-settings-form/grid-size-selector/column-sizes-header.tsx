import { Grid } from "@mui/material";
import { SIZES } from "../grid-sizes";
import { GAP } from "./constants";
import { HeaderItem } from "./header-item";

export function ColumnSizesHeader() {
  return (
    <Grid
      columns={SIZES.length}
      container
      spacing={GAP}
      className="absolute -top-2 right-0 left-0"
    >
      {SIZES.map((size) => (
        <HeaderItem key={size} size={size} />
      ))}
    </Grid>
  );
}
