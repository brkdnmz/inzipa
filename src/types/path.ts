export type PathData = {
  prevCell: [row: number, col: number][][]; // prevCell[r][c] = coords of the cell preceding (r, c)
  nextCell: [row: number, col: number][][];
};
