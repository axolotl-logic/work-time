import { fail } from "assert";
import "fake-indexeddb/auto";
import { vi } from "vitest";

vi.spyOn(console, "error").mockImplementation(() => {
  fail("console.error call detected");
});
