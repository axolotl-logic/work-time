"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { db } from "~/client/db";
import { Router } from "~/client/components/router";
import { useUserId } from "~/client/hooks/useUserId";
import { handleError } from "~/lib/error";
import { MINUTE } from "~/lib/time";

export default function Page() {
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

  const startTimeUser = Number(params.get("startTime"));
  const startTime = Number.isNaN(startTimeUser) ? 0 : startTimeUser;

  useEffect(() => {
    db.timer
      .add({
        userId,
        workLength,
        breakLength,
        startTime,
        others: 0,
        createdAt: Date.now(),
      })
      .catch(handleError);
    db.nav.add({ page: "timer", createdAt: Date.now() }).catch(handleError);
  }, [userId, workLength, breakLength, startTime]);

  return <Router defaultPage="timer" />;
}
