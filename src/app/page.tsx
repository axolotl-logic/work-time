"use client";

import { useState } from "react";
import useInterval from "use-interval";

const WORK_LENGTH = 50;
const BREAK_LENGTH = 60 - WORK_LENGTH;

function VisualTimer({
  status,
  progress,
}: {
  status: "break" | "work";
  progress: number;
}) {
  return (
    <div
      className={`radial-progress text-5xl ${status === "work" ? "text-primary" : "text-secondary"}`}
      style={
        {
          "--value": progress,
          "--size": "300px",
          "--thickness": "35px",
        } as React.CSSProperties
      }
      role="progressbar"
    >
      {status}
    </div>
  );
}

// TODO: A button that says "Hearts!" that people can spam.

export default function HomePage() {
  const [status, setStatus] = useState<"work" | "break">("work");
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  useInterval(() => {
    const now = Date.now();
    const mins_after_hour = Math.floor(now / 1000 / 60) % 60;
    if (mins_after_hour > WORK_LENGTH) {
      setStatus("break");
      setMins(WORK_LENGTH + BREAK_LENGTH - mins_after_hour);
    } else {
      setStatus("work");
      setMins(WORK_LENGTH - mins_after_hour);
    }
    setSecs(59 - Math.floor((Date.now() / 1000) % 60));
  }, 50);

  const progress =
    100 - (mins / (status == "work" ? WORK_LENGTH : BREAK_LENGTH)) * 100;

  const bg = status == "work" ? "bg-black" : "bg-black";
  const fg = status == "work" ? "text-white" : "text-white";

  return (
    <main
      className={`${bg} ${fg} flex min-h-screen flex-col items-center justify-center gap-5 font-mono uppercase`}
    >
      <VisualTimer status={status} progress={progress} />
      <div className="text-2xl">
        {mins}:{String(secs).padStart(2, "0")}
      </div>
    </main>
  );
}
