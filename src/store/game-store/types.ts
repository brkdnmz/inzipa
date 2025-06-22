import type { Coordinates } from "@/types/cell";
import type { GridData } from "@/types/grid";

/*
  The type [Coordinates, ...Coordinates[]] would be more appropriate for the steps array,
  but hard TS errors appeared that I couldn't figure a nice way to resolve.
*/

export type GameState = {
  grid: GridData;
  steps: Coordinates[]; // First step is always the start cell
  startedAt: Date | null;
  finishedAt: Date | null;

  isVisited: (cell: Coordinates) => boolean;
};

export type GameActions = {
  start: () => void;
  makeMove: (targetCell: Coordinates, isDragging?: boolean) => void;
};

export type GameStore = GameState & { actions: GameActions };
