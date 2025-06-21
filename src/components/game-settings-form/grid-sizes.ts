export const SIZES = [2, 4, 6, 8, 10] as const;

export type AvailableGridSize = [
  (typeof SIZES)[number],
  (typeof SIZES)[number],
];

export const DEFAULT_SIZE: AvailableGridSize = [6, 6];
