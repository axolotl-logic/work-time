"use client";

import { useEffect } from "react";
import { Router } from "~/client/components/router";
import { db } from "~/client/db";
import { handleError } from "~/lib/error";

export default function Page() {
  useEffect(() => {
    db.nav.add({ page: "home", createdAt: Date.now() }).catch(handleError);
  }, []);

  return <Router defaultPage="home" />;
}
