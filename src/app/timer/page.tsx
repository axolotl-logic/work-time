"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { db } from "~/client/db";
import { HomePage } from "~/components/home-page";
import { useUserId } from "~/hooks/useUserId";
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
        createdAt: Date.now(),
      })
      .catch(handleError);
  }, [userId, workLength, breakLength, startTime]);

  return <HomePage timerOpen={true} />;
}
