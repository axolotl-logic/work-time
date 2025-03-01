import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "~/app/page";

test("Page", () => {
  vi.mock("server-only", () => {
    return {
      // mock server-only module
    };
  });
  render(<Page />);
  expect(screen.getByRole("main")).toBeDefined();
});
