import { Stack } from "@mui/material";
import { type AvailableGridSize } from "../grid-sizes";
import { ColumnSizesHeader } from "./column-sizes-header";
import { GAP } from "./constants";
import { RowSizesHeader } from "./row-sizes-header";
import { SizeGrid } from "./size-grid";

type GridSizeSelectorProps = {
  size: AvailableGridSize;
  onChange: (size: AvailableGridSize) => void;
};

export function GridSizeSelector({ size, onChange }: GridSizeSelectorProps) {
  return (
    <Stack spacing={GAP} className="relative pt-3">
      <ColumnSizesHeader />

      <RowSizesHeader />

      <SizeGrid selectedSize={size} onChange={onChange} />
    </Stack>
  );
}
