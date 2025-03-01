"use client";

import { useCallback, useEffect, useState } from "react";
import useInterval from "use-interval";
import { useLocalStorage } from "usehooks-ts";
import { ping } from "~/server/actions";
import { v4 as uuidv4 } from "uuid";

const WORK_LENGTH = 50;
const BREAK_LENGTH = 60 - WORK_LENGTH;

function VisualTimer({
  status,
  progress,
}: {
  status: "break" | "work";
  progress: number;
}) {
  let radialColor: string;
  switch (status) {
    case "break":
      radialColor = "text-secondary";
      break;
    case "work":
      radialColor = "text-primary";
      break;
  }

  return (
    <div
      className={`radial-progress text-5xl ${radialColor}`}
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

function useUserId(): string {
  const [userId, setUserId] = useLocalStorage("function:useUserId", () =>
    uuidv4(),
  );
  useEffect(() => {
    setUserId(userId);
  }, [userId, setUserId]);

  return userId;
}

// TODO: A button that says "Hearts!" that people can spam.

export default function HomePage() {
  const [status, setStatus] = useState<"loading" | "work" | "break">("loading");
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const userId = useUserId();

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

  const [others, setOthers] = useState<{
    count: number;
    status: "loading" | "offline" | "active";
  }>({ count: 0, status: "loading" });

  const sync = useCallback(() => {
    ping(userId)
      .then(({ buddiesCount }) =>
        setOthers((oldOthers) => ({
          ...oldOthers,
          status: "active",
          count: buddiesCount,
        })),
      )
      .catch(() =>
        setOthers((oldOthers) => ({
          ...oldOthers,
          status: "offline",
          count: 0,
        })),
      );
  }, [userId, setOthers]);

  useInterval(sync, 1000 * 60 * 10);
  useEffect(sync, [sync]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-gray-950 font-mono lowercase text-gray-100`}
    >
      {status !== "loading" && (
        <div className={`animate-fade-in flex flex-col gap-8`}>
          <VisualTimer status={status} progress={progress} />
          <div className="flex flex-col flex-wrap items-center justify-between gap-2">
            <div className="font-mono text-2xl">
              {mins}:{String(secs).padStart(2, "0")}
            </div>
            {others.status == "active" && (
              <p className="animate-fade-in text-lg text-gray-100/80">
                {status == "work" ? "Working" : "Partying"} with {others.count}{" "}
                others.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
