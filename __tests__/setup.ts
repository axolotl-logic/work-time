import { cleanup } from "@testing-library/react";
import { fail } from "assert";
import "fake-indexeddb/auto";
import { afterEach, beforeEach, vi } from "vitest";

vi.spyOn(console, "error").mockImplementation(() => {
  //  fail("console.error call detected");
});

beforeEach(() => {
  // tell vitest we use mocked time
  vi.useFakeTimers();
});

afterEach(() => {
  // restoring date after each test run
  vi.useRealTimers();
  cleanup();
});
