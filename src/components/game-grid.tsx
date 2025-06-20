import { ANIMATION_DURATION } from "@/constants";
import { useGameContext } from "@/context/game-context";
import clsx from "clsx";
import { AnimatePresence, interpolate, motion } from "motion/react";
import { useCallback, useMemo } from "react";

type GameGridProps = {
  cellSize: number;
  borderWidth: number;
};

export function GameGrid({ cellSize, borderWidth }: GameGridProps) {
  const {
    grid,
    steps,
    isVisited,
    actions: { makeMove },
  } = useGameContext();

  const pathSegments = useMemo(
    () =>
      steps.map(([r, c], i) => {
        const prev = steps[Math.max(i - 1, 0)];

        let totalLengthUntilPrev = 0;

        for (let j = 0; j < i; j++) {
          const [pr, pc] = steps[j];
          totalLengthUntilPrev +=
            Math.abs(pr - steps[Math.max(j - 1, 0)][0]) +
            Math.abs(pc - steps[Math.max(j - 1, 0)][1]) +
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
            )}
          />
        );
      }),
    [steps, grid.rows, grid.cols, cellSize, borderWidth],
  );

  const onClickCell = useCallback(
    (row: number, col: number) => {
      makeMove([row, col]);
    },
    [makeMove],
  );

  // TODO: This runs on initial render too, which is not desired
  // useEffect(() => {
  //   navigator.vibrate(10); // Vibrate on every successful press
  // }, [steps]);

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
                onClick={() => onClickCell(r, c)}
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
                    key={+isVisited([r, c])}
                    initial={{ scale: isVisited([r, c]) ? 1.5 : 1 }}
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
                    key={+isVisited([r, c])}
                    initial={{ scale: isVisited([r, c]) ? 1.5 : 1 }}
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
