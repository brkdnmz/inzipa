import type { Coordinates } from "@/types/cell";
import type { PathData } from "@/types/path";
import { array2d, shuffleArray } from "./util";

// Liked this one pretty much:
// https://stackoverflow.com/questions/1987183/randomized-algorithm-for-finding-hamiltonian-path-in-a-directed-graph
export function generatePath(rows: number, cols: number): PathData {
  const prevCell: [row: number, col: number][][] = array2d(
    rows,
    cols,
    [-1, -1],
  );

  const nextCell: [row: number, col: number][][] = array2d(
    rows,
    cols,
    [-1, -1],
  );

  const visited: boolean[][] = array2d(rows, cols, false);

  const isSafe = (row: number, col: number) => {
    return row >= 0 && row < rows && col >= 0 && col < cols;
  };

  const dx = [0, 1, 0, -1] as const;
  const dy = [1, 0, -1, 0] as const;

  let totalUnvisited = rows * cols;

  function genPathRecursive(
    row: number,
    col: number,
  ): [continueRow: number, continueCol: number] | null {
    totalUnvisited -= +!visited[row][col];
    visited[row][col] = true;

    if (!totalUnvisited) return null;

    const dirs = shuffleArray([0, 1, 2, 3]);

    for (const d of dirs) {
      const nr = row + dx[d],
        nc = col + dy[d];

      if (!isSafe(nr, nc) || visited[nr][nc]) continue;

      nextCell[row][col] = [nr, nc];
      prevCell[nr][nc] = [row, col];
      return genPathRecursive(nr, nc);
    }

    for (const d of dirs) {
      const nr = row + dx[d],
        nc = col + dy[d];

      if (
        !isSafe(nr, nc) ||
        (prevCell[row][col][0] === nr && prevCell[row][col][1] === nc)
      )
        continue;

      /// Update (reverse) the subpath
      nextCell[row][col] = [nr, nc]; // this is gonna be reversed
      const [nnr, nnc] = nextCell[nr][nc]; // next of next
      nextCell[nr][nc] = [row, col]; // redirect the neighbor to this cell
      prevCell[nnr][nnc] = [-1, -1];

      for (
        let curR = row, curC = col;
        curR !== -1;
        [curR, curC] = nextCell[curR][curC]
      ) {
        [prevCell[curR][curC], nextCell[curR][curC]] = [
          nextCell[curR][curC],
          prevCell[curR][curC],
        ];
      }
      /// Update end

      return [nnr, nnc];
    }

    // unreachable but ts complains anyway
    return null;
  }

  const sr = Math.floor(Math.random() * rows);
  const sc = Math.floor(Math.random() * cols);

  let cr = sr,
    cc = sc;

  // eslint-disable-next-line no-constant-condition
  while (1) {
    const cont = genPathRecursive(cr, cc);

    if (cont === null) break;

    cr = cont[0];
    cc = cont[1];
  }

  const cells: Coordinates[] = [];

  cr = sr;
  cc = sc;
  cells.push([cr, cc]);
  while (nextCell[cr][cc][0] !== -1) {
    [cr, cc] = nextCell[cr][cc];
    cells.push([cr, cc]);
  }

  return {
    cells,
    prevCell,
    nextCell,
  };
}
