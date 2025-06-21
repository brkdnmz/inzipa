import { isBetween, onSameRowOrCol } from "@/lib/grid-helper";
import type { GridData } from "@/types/grid";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GameStore } from "./types";

export function createGameStore(grid: GridData) {
  return createStore<GameStore>()(
    immer((set, get) => ({
      grid: grid,
      steps: [grid.path.cells[0]],
      startedAt: null,
      finishedAt: null,

      isVisited: (cell) => {
        const steps = get().steps;
        for (let i = 0; i < steps.length; i++) {
          const curStep = steps[i];
          const prevStep = steps[Math.max(i - 1, 0)];

          if (isBetween(cell, curStep, prevStep)) {
            return true;
          }
        }

        return false;
      },

      actions: {
        start: () =>
          set((state) => {
            state.startedAt = new Date();
          }),
        makeMove: (targetCell) =>
          set((state) => {
            if (state.isVisited(targetCell)) {
              // Go back to this cell

              // Undo all steps made after the step that passes through this cell
              let involvedStepIndex = null;
              for (let i = 0; i < state.steps.length; i++) {
                const curStep = state.steps[i];
                const prevStep = state.steps[Math.max(i - 1, 0)];

                if (isBetween(targetCell, curStep, prevStep)) {
                  involvedStepIndex = i;
                  break;
                }
              }

              if (involvedStepIndex === null) {
                console.warn(
                  "UNEXPECTED: No step found that passes through the cell",
                );
                return;
              }

              state.steps = state.steps.slice(0, involvedStepIndex);
              state.steps.push(targetCell);
            } else {
              const lastStep = state.steps[state.steps.length - 1];
              const prevStep =
                state.steps[state.steps.length - 2] ?? grid.path.cells[0];

              if (!onSameRowOrCol(lastStep, targetCell)) {
                // invalid move
                return;
              }

              // TODO: Not performant O(n^2) but the grid is small anyway (n from this loop, other n from isVisited)
              for (
                let r = Math.min(lastStep[0], targetCell[0]) + 1;
                r < Math.max(lastStep[0], targetCell[0]);
                r++
              ) {
                if (state.isVisited([r, targetCell[1]])) {
                  // invalid move
                  return;
                }
              }

              for (
                let c = Math.min(lastStep[1], targetCell[1]) + 1;
                c < Math.max(lastStep[1], targetCell[1]);
                c++
              ) {
                if (state.isVisited([targetCell[0], c])) {
                  // invalid move
                  return;
                }
              }

              if (
                state.steps.length === 1 ||
                !(
                  onSameRowOrCol(prevStep, targetCell) &&
                  onSameRowOrCol(lastStep, targetCell) &&
                  onSameRowOrCol(prevStep, lastStep)
                )
              ) {
                state.steps.push(targetCell);
              } else {
                state.steps[state.steps.length - 1] = targetCell;
              }
            }
          }),
      },
    })),
  );
}
