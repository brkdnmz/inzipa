import type { GameState } from "@/store/game-store/types";
import type { Coordinates } from "@/types/cell";

export function isBetween(
  targetCell: Coordinates,
  cell1: Coordinates,
  cell2: Coordinates,
): boolean {
  // The only difference between row and col is array index
  for (let i = 0; i < 2; i++) {
    if (
      targetCell[i] < Math.min(cell1[i], cell2[i]) ||
      targetCell[i] > Math.max(cell1[i], cell2[i])
    ) {
      return false;
    }
  }

  return true;
}

export function isEqual(cell1: Coordinates, cell2: Coordinates): boolean {
  return cell1[0] === cell2[0] && cell1[1] === cell2[1];
}

export function onSameRowOrCol(
  cell1: Coordinates,
  cell2: Coordinates,
): boolean {
  return cell1[0] === cell2[0] || cell1[1] === cell2[1];
}

export function checkIfGridCompleted({ grid, steps }: GameState): boolean {
  const { markedCells } = grid;
  const firstStep = steps[0];
  const lastStep = steps[steps.length - 1];
  const firstMarkedCell = grid.path.cells[0];
  const lastMarkedCell = grid.path.cells[grid.path.cells.length - 1];

  // First step must be the first marked cell
  if (!isEqual(firstStep, firstMarkedCell)) {
    return false;
  }

  // Last step must be the last marked cell
  if (!isEqual(lastStep, lastMarkedCell)) {
    return false;
  }

  let totalVisited = 1; // Start cell
  let lastVisitedMarkedCell = 1;

  for (let i = 1; i < steps.length; i++) {
    const curStep = steps[i];
    const prevStep = steps[Math.max(i - 1, 0)];

    const nNewlyVisitied =
      Math.abs(curStep[0] - prevStep[0]) + Math.abs(curStep[1] - prevStep[1]);

    totalVisited += nNewlyVisitied;

    for (let r = prevStep[0] + 1; r <= curStep[0]; r++) {
      if (grid.isMarked[r][curStep[1]]) {
        const markOrder =
          markedCells.findIndex((mc) => isEqual(mc, [r, curStep[1]])) + 2;

        // Marked cells must be visited in order
        if (markOrder !== lastVisitedMarkedCell + 1) return false;

        lastVisitedMarkedCell++;
      }
    }

    for (let r = prevStep[0] - 1; r >= curStep[0]; r--) {
      if (grid.isMarked[r][curStep[1]]) {
        const markOrder =
          markedCells.findIndex((mc) => isEqual(mc, [r, curStep[1]])) + 2;

        // Marked cells must be visited in order
        if (markOrder !== lastVisitedMarkedCell + 1) return false;

        lastVisitedMarkedCell++;
      }
    }

    for (let c = prevStep[1] + 1; c <= curStep[1]; c++) {
      if (grid.isMarked[curStep[0]][c]) {
        const markOrder =
          markedCells.findIndex((mc) => isEqual(mc, [curStep[0], c])) + 2;

        // Marked cells must be visited in order
        if (markOrder !== lastVisitedMarkedCell + 1) return false;

        lastVisitedMarkedCell++;
      }
    }

    for (let c = prevStep[1] - 1; c >= curStep[1]; c--) {
      if (grid.isMarked[curStep[0]][c]) {
        const markOrder =
          markedCells.findIndex((mc) => isEqual(mc, [curStep[0], c])) + 2;

        // Marked cells must be visited in order
        if (markOrder !== lastVisitedMarkedCell + 1) return false;

        lastVisitedMarkedCell++;
      }
    }
  }

  if (totalVisited !== grid.rows * grid.cols) {
    // All cells must be visited
    return false;
  }

  return true;
}
