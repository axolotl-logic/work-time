"use client";

import { Router } from "~/client/components/router";

export default function Page() {
  return <Router defaultRoute={{ page: "home" }} />;
}
