import { GameGrid } from "@/components/game-grid";
import { BORDER_WIDTH, CELL_SIZE, GRID_SIZE } from "@/constants";
import { GameProvider } from "@/context/game-context";
import { generatePath } from "@/lib/path-gen";
import { array2d, shuffleArray } from "@/lib/util";
import type { GridData } from "@/types/grid";
import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/play/")({
  component: PlayGameComponent,
  validateSearch: (searchParams) => {
    return {
      rows:
        typeof searchParams.rows !== "number"
          ? GRID_SIZE.rows
          : searchParams.rows + (searchParams.rows % 2),
      cols:
        typeof searchParams.cols !== "number"
          ? GRID_SIZE.cols
          : searchParams.cols + (searchParams.cols % 2),
    };
  },
});

function PlayGameComponent() {
  const searchParams = Route.useSearch();

  const rows = searchParams.rows;
  const cols = searchParams.cols;

  const [path] = useState(() => generatePath(rows, cols));

  const markedCells = useMemo(
    () =>
      shuffleArray(
        path.cells
          .filter(
            ([r, c]) =>
              path.prevCell[r][c][0] !== -1 && path.nextCell[r][c][0] !== -1,
          )
          .map((c, i) => [c, i] as const),
      )
        .slice(0, 5)
        .sort((a, b) => a[1] - b[1])
        .map(([c]) => c),
    [path],
  );

  const grid: GridData = useMemo(
    () => ({
      rows: rows,
      cols: cols,
      path,
      markedCells,
      isMarked: array2d(rows, cols, false).map((row, r) =>
        row.map((_, c) => markedCells.some((mc) => mc[0] === r && mc[1] === c)),
      ),
    }),
    [cols, markedCells, path, rows],
  );

  return (
    <GameProvider grid={grid}>
      <Box className="m-auto flex flex-1 items-center justify-center px-5 py-5">
        <GameGrid cellSize={CELL_SIZE} borderWidth={BORDER_WIDTH} />
      </Box>
    </GameProvider>
  );
}
