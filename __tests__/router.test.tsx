import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "~/client/components/router";
import { HOUR } from "~/lib/time";

test("Router can render home", () => {
  render(<Router defaultRoute={{ page: "home" }} />);

  expect(screen.getByRole("main")).toBeDefined();
  expect(screen.getByText("Donate")).toBeDefined();
});

test("Router can render timer", () => {
  render(
    <Router
      defaultRoute={{
        page: "timer",
        workLength: HOUR,
        breakLength: HOUR,
        startTime: 0,
      }}
    />,
  );

  expect(screen.getByRole("main")).toBeDefined();
});
