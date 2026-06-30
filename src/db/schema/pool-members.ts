import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";

import { pools } from "./pools";
import { users } from "./users";

export const poolMembers = pgTable(
  "pool_members",
  {
    poolId: uuid("pool_id")
      .notNull()
      .references(() => pools.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (table) => [primaryKey({ columns: [table.poolId, table.userId] })],
);

export type PoolMember = typeof poolMembers.$inferSelect;
export type NewPoolMember = typeof poolMembers.$inferInsert;
