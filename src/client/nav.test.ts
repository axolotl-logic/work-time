import { expect, test } from "vitest";

import { navigate } from "./nav";

test("navigate should lead home", () => {
  navigate({
    page: "home",
  });

  expect(window.location.pathname).toEqual("/");
});
