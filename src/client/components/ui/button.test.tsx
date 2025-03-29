import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { expect, test } from "vitest";

test("<Button> should render a compliant button", () => {
  render(<Button />);
  expect(screen.getByRole("button"));
});
