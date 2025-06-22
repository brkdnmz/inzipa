import type { createGameStore } from "@/store/game-store";
import { createContext } from "react";

export const GameContext = createContext<ReturnType<
  typeof createGameStore
> | null>(null);
