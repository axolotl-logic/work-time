"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/client/db";
import { TimerPage } from "./timer-page";
import { HomePage } from "./home-page";
import { useSync } from "../hooks/sync";
import { useEventListener } from "usehooks-ts";
import { fail } from "assert";
import { useUserId } from "../hooks/useUserId";
import { LoadingPage } from "./loading-page";
import { navigate } from "../nav";

export type Route =
  | {
      page: "home";
    }
  | {
      page: "timer";
      workLength: number;
      breakLength: number;
      startTime: number;
    };

export function Router({ defaultRoute }: { defaultRoute: Route }) {
  const userId = useUserId();

  const nav = useLiveQuery(async () => {
    return await db.nav.orderBy("createdAt").last();
  });

  const timer = useLiveQuery(async () => {
    return await db.timer.orderBy("createdAt").last();
  });

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
      if (timer) {
        return (
          <TimerPage
            workLength={timer.workLength}
            breakLength={timer.breakLength}
            startTime={timer.startTime}
            others={timer.others}
          />
        );
      }
      break;
    default:
      return (
        <p role="alert" className="prose">
          Internal Error. Page path not found.
        </p>
      );
  }

  return <LoadingPage />;
}

export function routeToUrl(route: Route): string {
  switch (route.page) {
    case "home":
      return "/";
    case "timer":
      const { workLength, breakLength, startTime } = route;
      return `/timer?workLength=${workLength}&breakLength=${breakLength}&startTime=${startTime}`;
  }
}
