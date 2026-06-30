import { and, eq, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";

import type { BolaoSummary } from "@/components/bolao/bolao-card";
import { db } from "@/db";
import { competitions, poolMembers, pools, type Pool } from "@/db/schema";
import type { BolaoRules } from "@/lib/bolao/rules";
import { DEFAULT_BOLAO_RULES } from "@/lib/bolao/rules";
import type { BolaoStatus } from "@/lib/bolao/status";

export type UserBoloes = {
  created: BolaoSummary[];
  participating: BolaoSummary[];
};

export class BolaoServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | "not_found"
      | "forbidden"
      | "invalid_status"
      | "competition_not_found"
      | "invalid_rules",
  ) {
    super(message);
    this.name = "BolaoServiceError";
  }
}

export async function listCompetitions() {
  return db
    .select({
      id: competitions.id,
      name: competitions.name,
      source: competitions.source,
      season: competitions.season,
    })
    .from(competitions)
    .where(eq(competitions.status, "active"));
}

export async function createDraftBolao(creatorId: string, competitionId: string): Promise<Pool> {
  const competition = await db
    .select({ id: competitions.id })
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);

  if (competition.length === 0) {
    throw new BolaoServiceError("Competition not found", "competition_not_found");
  }

  const slugToken = randomUUID();

  const [pool] = await db
    .insert(pools)
    .values({
      creatorId,
      competitionId,
      slugToken,
      status: "DRAFT",
      rulesJson: DEFAULT_BOLAO_RULES,
    })
    .returning();

  await db.insert(poolMembers).values({
    poolId: pool.id,
    userId: creatorId,
  });

  return pool;
}

async function getPoolForCreator(poolId: string, creatorId: string): Promise<Pool> {
  const rows = await db
    .select()
    .from(pools)
    .where(and(eq(pools.id, poolId), eq(pools.creatorId, creatorId)))
    .limit(1);

  if (rows.length === 0) {
    throw new BolaoServiceError("Pool not found", "not_found");
  }

  return rows[0];
}

export async function updateDraftBolaoRules(
  poolId: string,
  creatorId: string,
  rules: BolaoRules,
): Promise<Pool> {
  const pool = await getPoolForCreator(poolId, creatorId);

  if (pool.status !== "DRAFT") {
    throw new BolaoServiceError("Only DRAFT pools can be updated in the wizard", "invalid_status");
  }

  const [updated] = await db
    .update(pools)
    .set({ rulesJson: rules, updatedAt: new Date() })
    .where(eq(pools.id, poolId))
    .returning();

  return updated;
}

export async function completeBolao(
  poolId: string,
  creatorId: string,
  name: string,
  description?: string,
): Promise<Pool> {
  const pool = await getPoolForCreator(poolId, creatorId);

  if (pool.status !== "DRAFT") {
    throw new BolaoServiceError("Only DRAFT pools can be completed", "invalid_status");
  }

  const [updated] = await db
    .update(pools)
    .set({
      name: name.trim(),
      description: description?.trim() || null,
      status: "OPEN",
      updatedAt: new Date(),
    })
    .where(eq(pools.id, poolId))
    .returning();

  return updated;
}

export async function updateOpenBolaoRules(
  poolId: string,
  creatorId: string,
  rules: BolaoRules,
): Promise<Pool> {
  const pool = await getPoolForCreator(poolId, creatorId);

  if (pool.status !== "OPEN") {
    throw new BolaoServiceError("Rules can only be edited while pool is OPEN", "invalid_status");
  }

  const [updated] = await db
    .update(pools)
    .set({ rulesJson: rules, updatedAt: new Date() })
    .where(eq(pools.id, poolId))
    .returning();

  return updated;
}

export async function deleteBolao(poolId: string, creatorId: string): Promise<void> {
  const pool = await getPoolForCreator(poolId, creatorId);

  if (pool.status !== "DRAFT" && pool.status !== "OPEN") {
    throw new BolaoServiceError("Pool can only be deleted in DRAFT or OPEN status", "invalid_status");
  }

  await db.delete(pools).where(eq(pools.id, poolId));
}

export async function listUserBoloes(userId: string): Promise<UserBoloes> {
  const createdRows = await db
    .select({
      id: pools.id,
      name: pools.name,
      status: pools.status,
    })
    .from(pools)
    .where(eq(pools.creatorId, userId));

  const participatingRows = await db
    .select({
      id: pools.id,
      name: pools.name,
      status: pools.status,
    })
    .from(poolMembers)
    .innerJoin(pools, eq(poolMembers.poolId, pools.id))
    .where(and(eq(poolMembers.userId, userId), isNull(poolMembers.leftAt)));

  const created: BolaoSummary[] = createdRows.map((row) => ({
    id: row.id,
    name: row.name || "Rascunho",
    status: row.status as BolaoStatus,
  }));

  const participating: BolaoSummary[] = participatingRows
    .filter((row) => !createdRows.some((createdRow) => createdRow.id === row.id))
    .map((row) => ({
      id: row.id,
      name: row.name || "Rascunho",
      status: row.status as BolaoStatus,
    }));

  return { created, participating };
}

export async function getBolaoById(poolId: string, userId: string): Promise<Pool | null> {
  const membership = await db
    .select({ poolId: poolMembers.poolId })
    .from(poolMembers)
    .where(and(eq(poolMembers.poolId, poolId), eq(poolMembers.userId, userId), isNull(poolMembers.leftAt)))
    .limit(1);

  if (membership.length === 0) {
    return null;
  }

  const rows = await db.select().from(pools).where(eq(pools.id, poolId)).limit(1);
  return rows[0] ?? null;
}
