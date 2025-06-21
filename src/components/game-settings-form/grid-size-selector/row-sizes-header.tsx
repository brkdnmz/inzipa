import { Stack } from "@mui/material";
import { SIZES } from "../grid-sizes";
import { HeaderItem } from "./header-item";

export function RowSizesHeader() {
  return (
    <Stack className="absolute top-5 bottom-0 -left-7 m-0 flex w-fit flex-col items-end gap-2 p-0">
      {SIZES.map((size) => (
        <HeaderItem key={size} size={size} />
      ))}
    </Stack>
  );
}
