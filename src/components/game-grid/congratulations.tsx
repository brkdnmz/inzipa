import { motion } from "motion/react";

export function Congratulations() {
  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 text-3xl font-bold text-amber-400 select-none"
    >
      Bravo!
    </motion.div>
  );
}
