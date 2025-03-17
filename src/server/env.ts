"server-only";

import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
});

export const env = EnvSchema.parse(process.env);
