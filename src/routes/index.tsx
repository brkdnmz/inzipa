import { GameGrid } from "@/components/game-grid";
import { BORDER_WIDTH, CELL_SIZE, GRID_SIZE } from "@/constants";
import { generatePath } from "@/lib/path-gen";
import { Box, Container } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [path] = useState(() => generatePath(GRID_SIZE.rows, GRID_SIZE.cols));

  const grid = useMemo(
    () => ({
      rows: GRID_SIZE.rows,
      cols: GRID_SIZE.cols,
      path,
    }),
    [path],
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
