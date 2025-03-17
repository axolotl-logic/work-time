import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimerPage } from "~/client/components/timer-page";

test("TimerPage has main", () => {
  render(<TimerPage />);
  expect(screen.getByRole("main")).toBeDefined();
});
