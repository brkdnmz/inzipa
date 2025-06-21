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
