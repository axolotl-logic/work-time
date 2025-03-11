// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  integer,
  pgTableCreator,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `perpetual-sprint_${name}`);

export const announces = createTable("announaces", {
  id: uuid("id")
    .default(sql`uuid_generate_v7()`)
    .primaryKey()
    .defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastPingedAt: timestamp("last_pinged_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  pingedCount: integer("pinged_count").default(0).notNull(),
  workLength: integer("work_length").default(0).notNull(),
  breakLength: integer("break_length").default(0).notNull(),
  startTime: bigint({ mode: "number" }),
});
