import { ANIMATION_DURATION } from "@/constants";
import { array2d } from "@/lib/util";
import type { Coordinates } from "@/types/cell";
import type { GridData } from "@/types/grid";
import clsx from "clsx";
import { AnimatePresence, interpolate, motion } from "motion/react";
import { useMemo, useState } from "react";

type GameGridProps = {
  grid: GridData;
  cellSize: number;
  borderWidth: number;
};

export function GameGrid({ grid, cellSize, borderWidth }: GameGridProps) {
  const startCell: Coordinates = grid.path.cells[0];

  const [breakpoints, setBreakpoints] = useState<Coordinates[]>([]);

  const isFilled = useMemo(() => {
    const isFilled = array2d(
      grid.rows,
      grid.cols,
      (r, c) => grid.path.prevCell[r][c][0] === -1,
    );

    for (let i = 0; i < breakpoints.length; i++) {
      const [r, c] = breakpoints[i];
      const [pr, pc] = i ? breakpoints[i - 1] : startCell;
      for (let cr = Math.min(r, pr); cr <= Math.max(r, pr); cr++) {
        isFilled[cr][c] = true;
      }
      for (let cc = Math.min(c, pc); cc <= Math.max(c, pc); cc++) {
        isFilled[r][cc] = true;
      }
    }

    return isFilled;
  }, [breakpoints, grid.cols, grid.path.prevCell, grid.rows, startCell]);

  const tail = useMemo(
    () =>
      breakpoints.length ? breakpoints[breakpoints.length - 1] : startCell,
    [breakpoints, startCell],
  );

  const pathSegments = useMemo(
    () =>
      breakpoints.map(([r, c], i) => {
        const prev = i === 0 ? startCell : breakpoints[i - 1];

        let totalLengthUntilPrev = 0;

        for (let j = 0; j < i; j++) {
          const [pr, pc] = breakpoints[j];
          totalLengthUntilPrev +=
            Math.abs(pr - (j ? breakpoints[j - 1][0] : startCell[0])) +
            Math.abs(pc - (j ? breakpoints[j - 1][1] : startCell[1])) +
            1;
        }

        const curLength = Math.abs(r - prev[0]) + Math.abs(c - prev[1]) + 1;

        const startColor = interpolate(
          [0, grid.rows * grid.cols],
          [
            "#fcd34d", // start color (amber-300)
            "#f97316", // end color (amber-600)
          ],
        )(totalLengthUntilPrev);

        const endColor = interpolate(
          [0, grid.rows * grid.cols],
          [
            "#fcd34d", // start color (amber-300)
            "#f97316", // end color (amber-600)
          ],
        )(totalLengthUntilPrev + curLength - 1);

        return (
          <motion.div
            key={i}
            style={{
              background: `linear-gradient(${
                r > prev[0]
                  ? "to bottom"
                  : r < prev[0]
                    ? "to top"
                    : c > prev[1]
                      ? "to right"
                      : "to left"
              }, ${startColor}, ${endColor})`,
            }}
            initial={{
              left: `${prev[1] * cellSize + borderWidth / 2}px`,
              top: `${prev[0] * cellSize + borderWidth / 2}px`,
              right: `${(grid.cols - prev[1] - 1) * cellSize + borderWidth / 2}px`,
              bottom: `${(grid.rows - prev[0] - 1) * cellSize + borderWidth / 2}px`,
            }}
            animate={{
              left: `${Math.min(c, prev[1]) * cellSize + borderWidth / 2}px`,
              top: `${Math.min(r, prev[0]) * cellSize + borderWidth / 2}px`,
              right: `${(grid.cols - Math.max(c, prev[1]) - 1) * cellSize + borderWidth / 2}px`,
              bottom: `${(grid.rows - Math.max(r, prev[0]) - 1) * cellSize + borderWidth / 2}px`,
            }}
            exit={{
              left: `${prev[1] * cellSize + borderWidth / 2}px`,
              top: `${prev[0] * cellSize + borderWidth / 2}px`,
              right: `${(grid.cols - prev[1] - 1) * cellSize + borderWidth / 2}px`,
              bottom: `${(grid.rows - prev[0] - 1) * cellSize + borderWidth / 2}px`,
              // opacity: [null, 1, 0],
              transition: {
                duration: 0,
                // delay: (breakpoints.length - i - 1) * ANIMATION_DURATION,
                // times: [0, 1, 1],
              },
            }}
            transition={{ duration: ANIMATION_DURATION }}
            className={clsx(
              "pointer-events-none absolute z-10 m-0.5 rounded-full bg-amber-400 transition duration-150",
              // animations.size && "brightness-103",
            )}
            // style={{
            //   top: `${Math.min(r, prev[0]) * cellSize + borderWidth}px`,
            //   left: `${Math.min(c, prev[1]) * cellSize + borderWidth}px`,
            //   right: `${(grid.cols - Math.max(c, prev[1]) - 1) * cellSize}px`,
            //   bottom: `${(grid.rows - Math.max(r, prev[0]) - 1) * cellSize}px`,
            // }}
          />
        );
      }),
    [breakpoints, startCell, cellSize, borderWidth, grid.cols, grid.rows],
  );

  // @ts-expect-error unused function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClickCell_v1 = (row: number, col: number) => {
    if (row !== tail[0] && col !== tail[1]) return;

    const prevTail =
      breakpoints.length > 1 ? breakpoints[breakpoints.length - 2] : startCell;

    const sameAsPrevTail = row === prevTail[0] && col === prevTail[1];

    const isBetween =
      Math.min(tail[0], prevTail[0]) <= row &&
      row <= Math.max(tail[0], prevTail[0]) &&
      Math.min(tail[1], prevTail[1]) <= col &&
      col <= Math.max(tail[1], prevTail[1]);

    const isSameDirection =
      (row === tail[0] && tail[0] === prevTail[0]) ||
      (col === tail[1] && tail[1] === prevTail[1]);

    let nFilled = 0;

    for (let c = Math.min(col, tail[1]); c <= Math.max(col, tail[1]); c++) {
      if (c === tail[1]) continue;
      nFilled += +isFilled[row][c];
    }
    for (let r = Math.min(row, tail[0]); r <= Math.max(row, tail[0]); r++) {
      if (r === tail[0]) continue;
      nFilled += +isFilled[r][col];
    }

    if (!isBetween && nFilled) return;

    navigator.vibrate(10); // Vibrate on every successful click

    setBreakpoints((prev) => [
      ...prev.slice(0, prev.length - +(isBetween || isSameDirection)),
      ...(sameAsPrevTail ? [] : [[row, col] as Coordinates]),
    ]);
  };

  const onClickCell_v2 = (row: number, col: number) => {
    if (isFilled[row][col]) {
      let lastRemainingBreakpointIndex = breakpoints.length - 1;
      let sameAsPrevTail = false;

      while (lastRemainingBreakpointIndex >= 0) {
        const tail = breakpoints[lastRemainingBreakpointIndex];
        const prevTail =
          lastRemainingBreakpointIndex > 0
            ? breakpoints[lastRemainingBreakpointIndex - 1]
            : startCell;

        sameAsPrevTail = row === prevTail[0] && col === prevTail[1];

        const isBetween =
          Math.min(tail[0], prevTail[0]) <= row &&
          row <= Math.max(tail[0], prevTail[0]) &&
          Math.min(tail[1], prevTail[1]) <= col &&
          col <= Math.max(tail[1], prevTail[1]);

        lastRemainingBreakpointIndex--;

        if (isBetween && !sameAsPrevTail) break;
      }

      setBreakpoints((prev) => [
        ...prev.slice(0, lastRemainingBreakpointIndex + 1),
        ...(sameAsPrevTail ? [] : [[row, col] as Coordinates]),
      ]);
    } else {
      if (row !== tail[0] && col !== tail[1]) return;

      const prevTail =
        breakpoints.length > 1
          ? breakpoints[breakpoints.length - 2]
          : startCell;

      const isBetween =
        Math.min(tail[0], prevTail[0]) <= row &&
        row <= Math.max(tail[0], prevTail[0]) &&
        Math.min(tail[1], prevTail[1]) <= col &&
        col <= Math.max(tail[1], prevTail[1]);

      let nFilledBetween = 0;

      for (let c = Math.min(col, tail[1]); c <= Math.max(col, tail[1]); c++) {
        if (c === tail[1]) continue;
        nFilledBetween += +isFilled[row][c];
      }
      for (let r = Math.min(row, tail[0]); r <= Math.max(row, tail[0]); r++) {
        if (r === tail[0]) continue;
        nFilledBetween += +isFilled[r][col];
      }

      const isSameDirection =
        (row === tail[0] && tail[0] === prevTail[0]) ||
        (col === tail[1] && tail[1] === prevTail[1]);

      if (!isFilled[row][col] && !isBetween && nFilledBetween) return;

      setBreakpoints((prev) => [
        ...prev.slice(0, prev.length - +(isBetween || isSameDirection)),
        [row, col] as Coordinates,
      ]);
    }

    navigator.vibrate(10); // Vibrate on every successful click
  };

  return (
    <div className="relative grid w-fit overflow-hidden rounded-lg border-5 border-orange-300 bg-orange-100">
      <AnimatePresence>{pathSegments}</AnimatePresence>

      {Array.from({ length: grid.rows }).map((_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: grid.cols }).map((_, c) => {
            const isStart = grid.path.prevCell[r][c][0] === -1;
            const isEnd = grid.path.nextCell[r][c][0] === -1;

            const markedOrder = grid.markedCells.findIndex(
              (mc) => mc[0] === r && mc[1] === c,
            );

            return (
              <motion.div
                key={`${r}-${c}`}
                onClick={() => onClickCell_v2(r, c)}
                className={clsx(
                  "flex cursor-pointer items-center justify-center border-orange-200 p-0.5",
                )}
                initial={{
                  backgroundColor: "#fff0",
                }}
                whileTap={{
                  backgroundColor: "#fff",
                  transition: { duration: 0 },
                }}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderWidth: borderWidth / 2,
                  ...(!r ? { borderTopWidth: 0 } : undefined),
                  ...(!c ? { borderLeftWidth: 0 } : undefined),
                  ...(c === grid.cols - 1
                    ? { borderRightWidth: 0 }
                    : undefined),
                  ...(r === grid.rows - 1
                    ? { borderBottomWidth: 0 }
                    : undefined),
                }}
              >
                {isStart && (
                  <div
                    className="z-20 flex items-center justify-center rounded-full bg-amber-500 select-none"
                    style={{
                      width: cellSize - 4 - 2 * borderWidth,
                      height: cellSize - 4 - 2 * borderWidth,
                    }}
                  >
                    1
                  </div>
                )}

                {isEnd && (
                  <motion.div
                    key={+isFilled[r][c]}
                    initial={{ scale: isFilled[r][c] ? 1.5 : 1 }}
                    animate={{ scale: 1 }}
                    className="z-20 flex items-center justify-center rounded-full bg-amber-500 select-none"
                    style={{
                      width: cellSize - 4 - 2 * borderWidth,
                      height: cellSize - 4 - 2 * borderWidth,
                    }}
                  >
                    {grid.markedCells.length + 2}
                  </motion.div>
                )}

                {markedOrder >= 0 && (
                  <motion.div
                    key={+isFilled[r][c]}
                    initial={{ scale: isFilled[r][c] ? 1.5 : 1 }}
                    animate={{ scale: 1 }}
                    className="z-20 flex items-center justify-center rounded-full bg-amber-500 select-none"
                    style={{
                      width: cellSize - 4 - 2 * borderWidth,
                      height: cellSize - 4 - 2 * borderWidth,
                    }}
                  >
                    {markedOrder + 2}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
