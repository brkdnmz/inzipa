import { GameGrid } from "@/components/game-grid";
import { BORDER_WIDTH, CELL_SIZE, GRID_SIZE } from "@/constants";
import { generatePath } from "@/lib/path-gen";
import { array2d, shuffleArray } from "@/lib/util";
import type { GridData } from "@/types/grid";
import { Box, Container } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: (searchParams) => {
    return {
      rows:
        typeof searchParams.rows !== "number"
          ? undefined
          : searchParams.rows + (searchParams.rows % 2),
      cols:
        typeof searchParams.cols !== "number"
          ? undefined
          : searchParams.cols + (searchParams.cols % 2),
    };
  },
});

function RouteComponent() {
  const searchParams = Route.useSearch();

  const rows = searchParams.rows ?? GRID_SIZE.rows;
  const cols = searchParams.cols ?? GRID_SIZE.cols;

  const [path] = useState(() => generatePath(rows, cols));

  console.log(path.cells);

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
        .slice(0, 8)
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
    <Container className="flex min-h-screen">
      {/* <div
        {...bind()}
        className="absolute"
        style={{ translate: `${translate.x}px ${translate.y}px` }}
      >
        sadas
      </div> */}
      <Box className="flex flex-1 items-center justify-center">
        <GameGrid grid={grid} cellSize={CELL_SIZE} borderWidth={BORDER_WIDTH} />
      </Box>

      {/* <SvgGrid grid={grid} /> */}
    </Container>
  );
}
