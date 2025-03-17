import { useCallback, useEffect, useState } from "react";
import useInterval from "use-interval";
import { ping } from "~/server/actions";
import { MINUTE, padTime, splitTimeMs } from "~/lib/time";
import { useUserId } from "~/client/hooks/useUserId";
import { VisualTimer } from "~/client/components/visual-timer";
import { db } from "~/client/db";
import { useLiveQuery } from "dexie-react-hooks";

export function TimerPage() {
  const userId = useUserId();
  const [periodTime, setPeriodTime] = useState(0);
  const timer = useLiveQuery(async () => {
    return await db.timer.orderBy("createdAt").last();
  });

  useEffect(() => {
    if (!timer) {
      return;
    }

    const { workLength, breakLength, startTime } = timer;

    const url = `/timer?workLength=${workLength}&breakLength=${breakLength}&startTime=${startTime}`;
    if (window.location.href != url) {
      window.history.pushState(null, "", url);
    }
  }, [timer]);

  const [others, setOthers] = useState<{
    count: number;
    status: "loading" | "offline" | "active";
  }>({ count: 0, status: "loading" });

  const syncWithServer = useCallback(() => {
    if (!timer) {
      return;
    }

    const { workLength, breakLength, startTime } = timer;

    ping(userId, workLength, breakLength, startTime)
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
  }, [timer, userId, setOthers]);

  const syncTime = useCallback(() => {
    if (timer) {
      setPeriodTime(getPeriodTime(timer));
    }
  }, [timer]);

  useInterval(syncWithServer, 10 * MINUTE);
  useEffect(() => syncWithServer(), [syncWithServer]);
  useInterval(syncTime, 50);

  if (!timer) {
    return <div></div>;
  }

  const progress = getProgress({ periodTime }, timer);
  const status = getStatus({ periodTime }, timer);
  const { hours, minutes, seconds } = getCountdown(
    { periodTime, status },
    timer,
  );

  return (
    <div
      className={`animate-fade-in fixed top-0 left-0 z-10 flex size-full h-screen max-h-dvh flex-col items-center justify-center gap-8 bg-zinc-950`}
    >
      <div className="mt-auto">
        <VisualTimer status={status} progress={progress} />
      </div>
      <div className="flex flex-col flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-2xl">
          {hours > 0 && <span>{padTime(hours)}:</span>}
          {padTime(minutes)}:{padTime(seconds)}
        </div>
        <p className="text-lg italic">
          {others.status === "active" ? (
            <span className="animate-fade-in-slow">
              {status === "work" ? "Working" : "Partying"}
              {" in this room "}
              {others.status === "active" && ` with ${others.count} others`}
            </span>
          ) : (
            <span className="opacity-0">Loading...</span>
          )}
        </p>
      </div>
      <a
        onClick={async (e) => {
          e.preventDefault();
          await db.nav.add({ page: "home", createdAt: Date.now() });
        }}
        className="self-start p-4 text-blue-400 underline hover:cursor-pointer hover:text-purple-400"
      >
        home
      </a>
    </div>
  );
}
function getProgress(
  { periodTime }: { periodTime: number },
  {
    workLength,
    breakLength,
  }: {
    startTime: number;
    workLength: number;
    breakLength: number;
  },
): number {
  if (periodTime > workLength) {
    return (periodTime - workLength) / breakLength;
  } else {
    return periodTime / workLength;
  }
}

function getPeriodTime({
  startTime,
  workLength,
  breakLength,
}: {
  startTime: number;
  workLength: number;
  breakLength: number;
}): number {
  const period = workLength + breakLength;
  const now = Date.now();
  const periodsSinceEpoch = (now - startTime) / period;

  return (periodsSinceEpoch - Math.floor(periodsSinceEpoch)) * period;
}

function getCountdown(
  { periodTime, status }: { periodTime: number; status: "work" | "break" },
  {
    workLength,
    breakLength,
  }: {
    workLength: number;
    breakLength: number;
  },
): { hours: number; minutes: number; seconds: number } {
  switch (status) {
    case "work":
      return splitTimeMs(workLength - periodTime);
    case "break":
      return splitTimeMs(workLength + breakLength - periodTime);
  }
}

function getStatus(
  { periodTime }: { periodTime: number },
  {
    workLength,
  }: {
    workLength: number;
    breakLength: number;
  },
): "work" | "break" {
  return periodTime > workLength ? "break" : "work";
}
