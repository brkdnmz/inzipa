import type { Coordinates } from "./cell";
import type { PathData } from "./path";

export type GridData = {
  rows: number;
  cols: number;
  path: PathData;
  markedCells: Coordinates[]; // marked cells in order
  isMarked: boolean[][];
};
