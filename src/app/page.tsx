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
      radialColor = "text-pink-400";
      break;
    case "work":
      radialColor = "text-purple-300";
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
    const mins_epoch = now / 1000 / 60;
    const mins_epoch_whole = Math.floor(mins_epoch);
    const mins_after_hour =
      mins_epoch - mins_epoch_whole + (mins_epoch_whole % 60);

    if (mins_after_hour > WORK_LENGTH) {
      setStatus("break");
      setMins(mins_after_hour - WORK_LENGTH);
    } else {
      setStatus("work");
      setMins(mins_after_hour);
    }
    setSecs(59 - Math.floor((now / 1000) % 60));
  }, 50);

  const progress =
    status === "work"
      ? (mins / WORK_LENGTH) * 100
      : (mins / BREAK_LENGTH) * 100;

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
    <>
      {status !== "loading" && (
        <div
          className={`flex size-full animate-fade-in flex-col items-center justify-center gap-8`}
        >
          <VisualTimer status={status} progress={progress} />
          <div className="flex flex-col flex-wrap items-center justify-between gap-2">
            <div className="font-mono text-2xl">
              {Math.floor(mins)}:{String(secs).padStart(2, "0")}
            </div>
            <p className="text-lg italic">
              {others.status === "active" ? (
                <span className="animate-fade-in-slow">
                  {status === "work" ? "Working" : "Partying"}
                  {others.status === "active" && ` with ${others.count} others`}
                </span>
              ) : (
                <span className="opacity-0">Loading...</span>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
