import {
  useGameFinishedAt,
  useGameStartedAt,
} from "@/context/game-context/hooks";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function TimePassed() {
  const startedAt = useGameStartedAt();
  const finishedAt = useGameFinishedAt();
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const isStarted = startedAt !== null;
  const isFinished = finishedAt !== null;

  useEffect(() => {
    if (!isStarted || isFinished) {
      return;
    }

    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 500); // It's more reliable to update every 500ms than every second

    return () => clearInterval(interval);
  }, [isFinished, isStarted]);

  const timePassed =
    (isFinished ? finishedAt : currentTime).getTime() -
    (startedAt?.getTime() ?? 0);
  const secondsPassed = Math.floor(timePassed / 1000);
  const minutesPassed = Math.floor(secondsPassed / 60);
  const secondsRemaining = secondsPassed % 60;
  const millisecondsRemaining = timePassed % 1000;

  return (
    <motion.div
      key={+isStarted}
      className={clsx(
        "font-mono text-xl text-amber-400",
        !isStarted && "invisible",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {minutesPassed.toString().padStart(2, "0")}:
      {secondsRemaining.toString().padStart(2, "0")}
      {isFinished && "." + millisecondsRemaining.toString().padStart(3, "0")}
    </motion.div>
  );
}
