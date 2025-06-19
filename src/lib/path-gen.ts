import type { PathData } from "@/types/path";
import { shuffleArray } from "./util";

// Liked this one pretty much:
// https://stackoverflow.com/questions/1987183/randomized-algorithm-for-finding-hamiltonian-path-in-a-directed-graph
export function generatePath(rows: number, cols: number): PathData {
  const prevCell: [row: number, col: number][][] = Array.from(
    { length: rows },
    () => Array.from({ length: cols }, () => [-1, -1]),
  );

  const nextCell: [row: number, col: number][][] = Array.from(
    { length: rows },
    () => Array.from({ length: cols }, () => [-1, -1]),
  );

  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );

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

      let curR = row,
        curC = col;
      while (1) {
        [prevCell[curR][curC], nextCell[curR][curC]] = [
          nextCell[curR][curC],
          prevCell[curR][curC],
        ];

        [curR, curC] = nextCell[curR][curC];

        if (curR === -1) break;
      }
      /// Update end

      return [nnr, nnc];
    }

    // unreachable but ts complains anyway
    return null;
  }

  let sr = Math.floor(Math.random() * rows);
  let sc = Math.floor(Math.random() * cols);

  while (1) {
    const cont = genPathRecursive(sr, sc);

    if (cont === null) break;

    sr = cont[0];
    sc = cont[1];
  }

  return {
    prevCell,
    nextCell,
  };
}
