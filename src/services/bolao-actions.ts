"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { BolaoRules } from "@/lib/bolao/rules";
import {
  bolaoCompetitionStepSchema,
  bolaoFinalizeSchema,
  bolaoModesSchema,
  bolaoPointsSchema,
  bolaoRulesSchema,
  bolaoTiebreakerSchema,
} from "@/lib/validators/bolao";
import { createClient } from "@/lib/supabase/server";
import {
  BolaoServiceError,
  completeBolao,
  createDraftBolao,
  deleteBolao,
  updateDraftBolaoRules,
  updateOpenBolaoRules,
} from "@/services/boloes";

export type BolaoActionResult =
  | { success: true; poolId?: string }
  | { success: false; error: string };

async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

function mapServiceError(error: unknown): string {
  if (error instanceof BolaoServiceError) {
    return error.code;
  }
  return "unknownError";
}

export async function createDraftBolaoAction(competitionId: string): Promise<BolaoActionResult> {
  const parsed = bolaoCompetitionStepSchema.safeParse({ competitionId });
  if (!parsed.success) {
    return { success: false, error: "competitionRequired" };
  }

  try {
    const userId = await requireUserId();
    const pool = await createDraftBolao(userId, parsed.data.competitionId);
    revalidatePath("/dashboard");
    return { success: true, poolId: pool.id };
  } catch (error) {
    return { success: false, error: mapServiceError(error) };
  }
}

export async function saveWizardModesAction(
  poolId: string,
  modes: BolaoRules["modes"],
): Promise<BolaoActionResult> {
  const parsed = bolaoModesSchema.safeParse(modes);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "invalidRules" };
  }

  try {
    const userId = await requireUserId();
    const pool = await getPoolRules(poolId, userId);
    const rules: BolaoRules = { ...pool.rulesJson, modes: parsed.data };
    await updateDraftBolaoRules(poolId, userId, rules);
    return { success: true, poolId };
  } catch (error) {
    return { success: false, error: mapServiceError(error) };
  }
}

export async function saveWizardPointsAction(
  poolId: string,
  points: BolaoRules["points"],
): Promise<BolaoActionResult> {
  const parsed = bolaoPointsSchema.safeParse(points);
  if (!parsed.success) {
    return { success: false, error: "invalidRules" };
  }

  try {
    const userId = await requireUserId();
    const pool = await getPoolRules(poolId, userId);
    const rules: BolaoRules = { ...pool.rulesJson, points: parsed.data };
    await updateDraftBolaoRules(poolId, userId, rules);
    return { success: true, poolId };
  } catch (error) {
    return { success: false, error: mapServiceError(error) };
  }
}

export async function saveWizardTiebreakerAction(
  poolId: string,
  tiebreaker: BolaoRules["tiebreaker"],
): Promise<BolaoActionResult> {
  const parsed = bolaoTiebreakerSchema.safeParse({ tiebreaker });
  if (!parsed.success) {
    return { success: false, error: "invalidRules" };
  }

  try {
    const userId = await requireUserId();
    const pool = await getPoolRules(poolId, userId);
    const rules: BolaoRules = { ...pool.rulesJson, tiebreaker: parsed.data.tiebreaker };
    await updateDraftBolaoRules(poolId, userId, rules);
    return { success: true, poolId };
  } catch (error) {
    return { success: false, error: mapServiceError(error) };
  }
}

export async function finalizeBolaoAction(
  poolId: string,
  input: { name: string; description?: string },
): Promise<BolaoActionResult> {
  const parsed = bolaoFinalizeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "nameRequired" };
  }

  try {
    const userId = await requireUserId();
    await completeBolao(poolId, userId, parsed.data.name, parsed.data.description);
    revalidatePath("/dashboard");
    return { success: true, poolId };
  } catch (error) {
    return { success: false, error: mapServiceError(error) };
  }
}

export async function updateOpenRulesAction(
  poolId: string,
  rules: BolaoRules,
): Promise<BolaoActionResult> {
  const parsed = bolaoRulesSchema.safeParse(rules);
  if (!parsed.success) {
    return { success: false, error: "invalidRules" };
  }

  try {
    const userId = await requireUserId();
    await updateOpenBolaoRules(poolId, userId, parsed.data);
    revalidatePath("/dashboard");
    revalidatePath(`/boloes/${poolId}/regras`);
    return { success: true, poolId };
  } catch (error) {
    return { success: false, error: mapServiceError(error) };
  }
}

export async function deleteBolaoAction(poolId: string): Promise<BolaoActionResult> {
  try {
    const userId = await requireUserId();
    await deleteBolao(poolId, userId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: mapServiceError(error) };
  }
}

async function getPoolRules(poolId: string, userId: string) {
  const { getBolaoById } = await import("@/services/boloes");
  const pool = await getBolaoById(poolId, userId);
  if (!pool) {
    throw new BolaoServiceError("Pool not found", "not_found");
  }
  return pool;
}
