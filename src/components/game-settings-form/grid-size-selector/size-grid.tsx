import { Grid } from "@mui/material";
import { SIZES, type AvailableGridSize } from "../grid-sizes";
import { GAP } from "./constants";
import { GridCell } from "./grid-cell";

type SizeGridProps = {
  selectedSize: AvailableGridSize;
  onChange: (size: AvailableGridSize) => void;
};

export function SizeGrid({ selectedSize, onChange }: SizeGridProps) {
  return SIZES.map((rowSize) => (
    <Grid
      key={rowSize}
      columns={SIZES.length}
      container
      margin={0}
      spacing={GAP}
      className="items-center"
    >
      {SIZES.map((colSize) => (
        <GridCell
          key={colSize}
          rowSize={rowSize}
          colSize={colSize}
          selectedSize={selectedSize}
          onClick={onChange}
        />
      ))}
    </Grid>
  ));
}
