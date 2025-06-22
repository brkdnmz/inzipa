import type { GameStore } from "@/store/game-store/types";
import { useContext } from "react";
import { useStore } from "zustand";
import { GameContext } from "./context";

// https://zustand.docs.pmnd.rs/guides/initialize-state-with-props
export function useGameContext<T>(selector: (state: GameStore) => T): T {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  return useStore(context, selector);
}

export function useGameGrid() {
  const grid = useGameContext((state) => state.grid);
  return grid;
}

export function useGameSteps() {
  const steps = useGameContext((state) => state.steps);
  return steps;
}

export function useIsCellVisited() {
  const isVisited = useGameContext((state) => state.isVisited);
  return isVisited;
}

export function useGameActions() {
  const actions = useGameContext((state) => state.actions);
  return actions;
}

export function useGameStartedAt() {
  const startedAt = useGameContext((state) => state.startedAt);
  return startedAt;
}

export function useGameFinishedAt() {
  const endedAt = useGameContext((state) => state.finishedAt);
  return endedAt;
}
