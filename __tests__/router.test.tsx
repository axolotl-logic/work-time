import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "~/client/components/router";
import { db } from "~/client/db";
import { HOUR } from "~/lib/time";
import { handleError } from "~/lib/error";

test("Router can render home", () => {
  render(<Router defaultPage="home" />);

  expect(screen.getByRole("main")).toBeDefined();
  expect(screen.getByText("Donate")).toBeDefined();
});

test("Router can render timer", () => {
  const timer = {
    workLength: HOUR,
    breakLength: HOUR,
    startTime: 0,
    others: 0,
    userId: "phony",
    createdAt: Date.now(),
  };

  db.timer.add(timer).catch(handleError);

  render(<Router defaultPage="timer" />);

  expect(screen.getByRole("main")).toBeDefined();
});
