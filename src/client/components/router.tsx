"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/client/db";
import { TimerPage } from "./timer-page";
import { HomePage } from "./home-page";
import { useSync } from "../hooks/sync";
import { useEventListener } from "usehooks-ts";
import { fail } from "assert";
import { handleError } from "~/lib/error";
import { useUserId } from "../hooks/useUserId";
import { LoadingPage } from "./loading-page";

type PagePath = "home" | "timer";

export function Router({ defaultPage }: { defaultPage: PagePath }) {
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
        db.nav.add({ page: "home", createdAt: Date.now() }).catch(handleError);
        break;
      case "/timer":
        db.nav.add({ page: "timer", createdAt: Date.now() }).catch(handleError);

        const params = new URLSearchParams(document.location.search);

        db.timer
          .add({
            userId,
            workLength: Number(params.get("workLength")),
            breakLength: Number(params.get("breakLength")),
            startTime: Number(params.get("startTime")),
            others: 0,
            createdAt: Date.now(),
          })
          .catch(handleError);

        break;
      default:
        fail("path not found");
    }
  });

  switch (nav?.page ?? defaultPage) {
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
