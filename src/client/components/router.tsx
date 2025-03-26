"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/client/db";
import { TimerPage } from "./timer-page";
import { HomePage } from "./home-page";
import { useSync } from "~/client/hooks/sync";
import { useEventListener } from "usehooks-ts";
import { fail } from "assert";
import { useUserId } from "~/client/hooks/useUserId";
import { navigate, getSessionId } from "~/client/nav";
import { type Route } from "~/client/routes";
import { MINUTE } from "~/lib/time";

export function Router({ defaultRoute }: { defaultRoute: Route }) {
  const userId = useUserId();

  const nav = useLiveQuery(async () => {
    const rows = await db.nav
      .where("sessionId")
      .equals(getSessionId())
      .sortBy("createdAt");

    if (rows.length === 0) {
      return {
        page: defaultRoute.page,
      };
    }

    return rows[rows.length - 1];
  });

  let timer:
    | {
        workLength: number;
        breakLength: number;
        startTime: number;
        others: number;
      }
    | undefined = useLiveQuery(async () => {
    return await db.timer.orderBy("createdAt").last();
  });

  if (timer === undefined) {
    if (defaultRoute.page === "timer") {
      timer = {
        workLength: defaultRoute.workLength,
        breakLength: defaultRoute.breakLength,
        startTime: defaultRoute.startTime,
        others: 0,
      };
    } else {
      timer = {
        workLength: 50 * MINUTE,
        breakLength: 10 * MINUTE,
        startTime: 0,
        others: 0,
      };
    }
  }

  // Synchronize our local data store with the remote.
  // while page is active.
  useSync();

  useEventListener("popstate", () => {
    switch (window.location.pathname) {
      case "/":
        navigate({ page: "home" });
        break;
      case "/timer":
        const params = new URLSearchParams(document.location.search);

        const timer = {
          userId,
          workLength: Number(params.get("workLength")),
          breakLength: Number(params.get("breakLength")),
          startTime: Number(params.get("startTime")),
          others: 0,
          createdAt: Date.now(),
        };

        navigate({ page: "timer", ...timer });

        break;
      default:
        fail("path not found");
    }
  });

  switch (nav?.page ?? defaultRoute.page) {
    case "home":
      return <HomePage />;
    case "timer":
      return (
        <TimerPage
          workLength={timer.workLength}
          breakLength={timer.breakLength}
          startTime={timer.startTime}
          others={timer.others}
        />
      );
    default:
      return (
        <p role="alert" className="prose">
          Internal Error. Page path not found.
        </p>
      );
  }
}
