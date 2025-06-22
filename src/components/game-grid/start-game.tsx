import { Button } from "@mui/material";
import { motion } from "motion/react";

type StartGameProps = {
  onStart: () => void;
};

export function StartGame({ onStart }: StartGameProps) {
  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      className="absolute inset-0 z-20 flex items-center justify-center text-white backdrop-blur-xl"
    >
      <Button
        variant="contained"
        onClick={onStart}
        className="cursor-pointer rounded-lg px-4 py-2 text-lg font-semibold"
      >
        Başla
      </Button>
    </motion.div>
  );
}
