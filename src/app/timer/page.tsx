"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useInterval from "use-interval";
import { useLocalStorage } from "usehooks-ts";
import { ping } from "~/server/actions";
import { v4 as uuidv4 } from "uuid";
import { padTime, splitTimeMs } from "~/lib/time";
import { useSearchParams } from "next/navigation";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

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
  const loadedAt = useMemo(() => Date.now(), []);
  const [periodTime, setPeriodTime] = useState(0);
  const userId = useUserId();

  const params = useSearchParams();

  const workLengthUser = Number(params.get("workLength"));
  const workLength = Number.isNaN(workLengthUser)
    ? 50 * MINUTE
    : workLengthUser;

  const breakLengthUser = Number(params.get("breakLength"));
  const breakLength = Number.isNaN(breakLengthUser)
    ? 10 * MINUTE
    : breakLengthUser;

  const synced = params.get("sync") === "on";

  const calculatePeriod = useCallback(() => {
    const startTime = synced ? 0 : loadedAt;
    const period = workLength + breakLength;
    const now = Date.now();
    const periodsSinceEpoch = (now - startTime) / period;

    return (periodsSinceEpoch - Math.floor(periodsSinceEpoch)) * period;
  }, [workLength, breakLength, loadedAt, synced]);

  const inverseTime = useMemo(() => {
    if (periodTime > workLength) {
      return periodTime - workLength;
    }
    return periodTime;
  }, [periodTime, workLength]);

  const status = useMemo<"work" | "break">(() => {
    return periodTime > workLength ? "break" : "work";
  }, [periodTime, workLength]);

  const sectionLength = status === "work" ? workLength : breakLength;
  const progress = (inverseTime / sectionLength) * 100;

  const { hours, minutes, seconds } = useMemo(() => {
    const countdown = sectionLength - inverseTime;
    return splitTimeMs(countdown);
  }, [sectionLength, inverseTime]);

  useInterval(() => setPeriodTime(calculatePeriod()), 50);

  const [others, setOthers] = useState<{
    count: number;
    status: "loading" | "offline" | "active";
  }>({ count: 0, status: "loading" });

  const syncWithServer = useCallback(() => {
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

  useInterval(syncWithServer, 1000 * 60 * 10);
  useEffect(syncWithServer, [syncWithServer]);

  return (
    <div
      className={`animate-fade-in flex size-full min-h-screen flex-col items-center justify-center gap-8`}
    >
      <VisualTimer status={status} progress={progress} />
      <div className="flex flex-col flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-2xl">
          {workLength + breakLength > 1000 * 60 * 60 && (
            <span>{padTime(hours)}:</span>
          )}
          {padTime(minutes)}:{padTime(seconds)}
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
  );
}
