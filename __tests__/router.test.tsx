import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "~/client/components/router";

test("Router renders a page by default", () => {
  render(<Router defaultPage="home" />);

  expect(screen.getByRole("main")).toBeDefined();
  expect(screen.getByText("Donate")).toBeDefined();
});
