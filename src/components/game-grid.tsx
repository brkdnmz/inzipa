import type { GridData } from "@/types/grid";
import clsx from "clsx";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

type GameGridProps = {
  grid: GridData;
  cellSize: number;
  borderWidth: number;
};

export function GameGrid({ grid, cellSize, borderWidth }: GameGridProps) {
  const [isFilled, setIsFilled] = useState(() =>
    Array.from({ length: grid.rows }, (_, r) =>
      Array.from(
        { length: grid.cols },
        (_, c) => grid.path.prevCell[r][c][0] === -1,
      ),
    ),
  );

  const startCell: [number, number] = useMemo(() => {
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        if (grid.path.prevCell[r][c][0] === -1) return [r, c];
      }
    }
    return [-1, -1];
  }, [grid]);

  const [tail, setTail] = useState<[number, number]>(startCell);
  const [clicks, setClicks] = useState<[number, number][]>([]);

  const pathSegments = useMemo(
    () =>
      clicks.map(([r, c], i) => {
        const prev = i === 0 ? startCell : clicks[i - 1];

        return (
          <motion.div
            key={`${r}-${c}`}
            initial={{
              left: `${prev[1] * cellSize + borderWidth}px`,
              top: `${prev[0] * cellSize + borderWidth}px`,
              right: `${(grid.cols - prev[1] - 1) * cellSize}px`,
              bottom: `${(grid.rows - prev[0] - 1) * cellSize}px`,
            }}
            animate={{
              left: `${Math.min(c, prev[1]) * cellSize + borderWidth}px`,
              top: `${Math.min(r, prev[0]) * cellSize + borderWidth}px`,
              right: `${(grid.cols - Math.max(c, prev[1]) - 1) * cellSize}px`,
              bottom: `${(grid.rows - Math.max(r, prev[0]) - 1) * cellSize}px`,
            }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 m-2 rounded-full bg-amber-400"
            // style={{
            //   top: `${Math.min(r, prev[0]) * cellSize + borderWidth}px`,
            //   left: `${Math.min(c, prev[1]) * cellSize + borderWidth}px`,
            //   right: `${(grid.cols - Math.max(c, prev[1]) - 1) * cellSize}px`,
            //   bottom: `${(grid.rows - Math.max(r, prev[0]) - 1) * cellSize}px`,
            // }}
          />
        );
      }),
    [borderWidth, cellSize, clicks, grid.cols, grid.rows, startCell],
  );

  console.log(pathSegments);

  const onClickCell = (row: number, col: number) => {
    if (row !== tail[0] && col !== tail[1]) return;

    for (let c = Math.min(col, tail[1]); c <= Math.max(col, tail[1]); c++) {
      if (c === tail[1]) continue;
      if (isFilled[row][c]) return;
    }
    for (let r = Math.min(row, tail[0]); r <= Math.max(row, tail[0]); r++) {
      if (r === tail[0]) continue;
      if (isFilled[r][col]) return;
    }

    setTail([row, col]);
    setClicks((prev) => [...prev, [row, col]]);

    setIsFilled((prev) => {
      const newFilled = prev.map((r) => [...r]);
      for (let c = Math.min(col, tail[1]); c <= Math.max(col, tail[1]); c++) {
        if (c === tail[1]) continue;
        newFilled[row][c] = true;
      }

      for (let r = Math.min(row, tail[0]); r <= Math.max(row, tail[0]); r++) {
        if (r === tail[0]) continue;
        newFilled[r][col] = true;
      }
      return newFilled;
    });
  };

  return (
    <div className="relative grid w-fit rounded-lg border-5 border-orange-300 bg-orange-100">
      {pathSegments}
      {Array.from({ length: grid.rows }).map((_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: grid.cols }).map((_, c) => {
            const [pr, pc] = grid.path.prevCell[r][c];
            const [nr, nc] = grid.path.nextCell[r][c];
            const isStart = pr === -1;
            const isEnd = nr === -1;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onClickCell(r, c)}
                className={clsx(
                  "flex items-center justify-center border-orange-200 p-0.5",
                )}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderTopWidth: r ? borderWidth : 0,
                  borderLeftWidth: c ? borderWidth : 0,
                }}
              >
                {isStart && (
                  <div
                    className="z-20 flex items-center justify-center rounded-full bg-yellow-500 select-none"
                    style={{
                      width: cellSize - 4 - 2 * borderWidth,
                      height: cellSize - 4 - 2 * borderWidth,
                    }}
                  >
                    S
                  </div>
                )}
                {isEnd && (
                  <div
                    className="z-20 flex items-center justify-center rounded-full bg-purple-500 select-none"
                    style={{
                      width: cellSize - 4 - 2 * borderWidth,
                      height: cellSize - 4 - 2 * borderWidth,
                    }}
                  >
                    E
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
