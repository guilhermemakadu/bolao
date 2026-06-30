import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { BolaoRules } from "@/lib/bolao/rules";
import { DEFAULT_BOLAO_RULES } from "@/lib/bolao/rules";

import { competitions } from "./competitions";
import { users } from "./users";

export const pools = pgTable("pools", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id),
  competitionId: uuid("competition_id")
    .notNull()
    .references(() => competitions.id),
  name: text("name").notNull().default(""),
  description: text("description"),
  slugToken: text("slug_token").notNull().unique(),
  status: text("status").notNull().default("DRAFT"),
  rulesJson: jsonb("rules_json").$type<BolaoRules>().notNull().default(DEFAULT_BOLAO_RULES),
  startedAt: timestamp("started_at", { withTimezone: true }),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Pool = typeof pools.$inferSelect;
export type NewPool = typeof pools.$inferInsert;
