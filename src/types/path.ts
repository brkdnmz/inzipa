import type { Coordinates } from "./cell";

export type PathData = {
  prevCell: Coordinates[][]; // prevCell[r][c] = coords of the cell preceding (r, c)
  nextCell: Coordinates[][];
  cells: Coordinates[]; // all cells in the path in order
};
