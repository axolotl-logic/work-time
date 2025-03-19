"server-only";

import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url().default("postgresql://"),
});

export const env = EnvSchema.parse(process.env);
