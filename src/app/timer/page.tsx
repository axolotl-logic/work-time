"use client";

import { useSearchParams } from "next/navigation";
import { Router } from "~/client/components/router";
import { MINUTE } from "~/lib/time";

export default function Page() {
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

  return (
    <Router
      defaultRoute={{ page: "timer", workLength, breakLength, startTime }}
    />
  );
}
