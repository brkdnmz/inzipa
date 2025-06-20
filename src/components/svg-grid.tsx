import type { GridData } from "@/types/grid";

type SvgGridProps = {
  grid: GridData;
};

export function SvgGrid({ grid }: SvgGridProps) {
  const segments: string[] = [];

  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const [nr, nc] = grid.path.nextCell[r][c];
      if (nr === -1) continue;
      segments.push(
        `M${c * 10 + 5} ${r * 10 + 5} L${nc * 10 + 5} ${nr * 10 + 5}`,
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${grid.cols * 10} ${grid.rows * 10}`}
      className="border-2 bg-slate-500"
      onDrag={(e) => {
        console.log(e);
      }}
      onDragStart={(e) => {
        console.log(e);
      }}
    >
      <g stroke="black" strokeWidth="1" fill="none">
        {segments.map((d, i) => (
          <path key={i} d={d} stroke="black" strokeWidth={0.5} />
        ))}
      </g>
      <g fill="black">
        {grid.path.prevCell.map((row, r) =>
          row.map(([pr], c) => (
            <circle
              key={`${r}-${c}`}
              cx={c * 10 + 5}
              cy={r * 10 + 5}
              r={pr === -1 || grid.path.nextCell[r][c][0] === -1 ? 3 : 1}
              fill={
                pr === -1
                  ? "yellow"
                  : grid.path.nextCell[r][c][0] === -1
                    ? "purple"
                    : "white"
              }
            />
          )),
        )}
      </g>
    </svg>
  );
}
