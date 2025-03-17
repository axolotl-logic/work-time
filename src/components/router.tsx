"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/client/db";
import { TimerPage } from "./timer-page";
import { HomePage } from "./home-page";
import { useEffect } from "react";
import { handleError } from "~/lib/error";

type PagePath = "home" | "timer";

export function Router({ defaultPage }: { defaultPage: PagePath }) {
  const nav = useLiveQuery(async () => {
    return await db.nav.orderBy("createdAt").last();
  });

  useEffect(() => {
    db.nav.add({ page: defaultPage, createdAt: Date.now() }).catch(handleError);
  }, [defaultPage]);

  switch (nav?.page ?? defaultPage) {
    case "home":
      return <HomePage />;
    case "timer":
      return <TimerPage />;
    default:
      return <p className="prose">Internal Error. Page path not found.</p>;
  }
}
