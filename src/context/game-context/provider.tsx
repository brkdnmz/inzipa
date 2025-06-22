import { createGameStore } from "@/store/game-store";
import type { GridData } from "@/types/grid";
import { useRef, type PropsWithChildren } from "react";
import { GameContext } from "./context";

export type GameProviderProps = PropsWithChildren<{
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
