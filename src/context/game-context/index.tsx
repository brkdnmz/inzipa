import { createGameStore } from "@/store/game-store";
import type { GridData } from "@/types/grid";
import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from "react";
import { useStore } from "zustand";

const GameContext = createContext<ReturnType<typeof createGameStore> | null>(
  null,
);

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return useStore(context);
}

type GameProviderProps = PropsWithChildren<{
  grid: GridData;
}>;

export function GameProvider({ grid, children }: GameProviderProps) {
  const gameStoreRef = useRef<ReturnType<typeof createGameStore> | null>(null);

  if (!gameStoreRef.current) {
    gameStoreRef.current = createGameStore(grid);
  }

  return (
    <GameContext.Provider value={gameStoreRef.current}>
      {children}
    </GameContext.Provider>
  );
}
