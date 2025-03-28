import { type Config } from "drizzle-kit";

import { env } from "~/server/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["perpetual-sprint_*"],
} satisfies Config;
