// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// yes i stackoverflowed this yes yes
export function shuffleArray<T>(array: Array<T>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function array2d<T extends number | string | boolean | object>(
  n: number,
  m: number,
  value: T | ((i: number, j: number) => T),
): Array<Array<T>> {
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: m }, (_, c) =>
      typeof value === "function" ? value(r, c) : value,
    ),
  );
}
