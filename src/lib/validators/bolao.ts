import { z } from "zod";

import { DEFAULT_BOLAO_RULES, TIEBREAKER_OPTIONS } from "@/lib/bolao/rules";

const modesSchema = z
  .object({
    exactScore: z.boolean(),
    result: z.boolean(),
    tournamentExtras: z.boolean(),
  })
  .refine((modes) => modes.exactScore || modes.result || modes.tournamentExtras, {
    message: "modeRequired",
  });

const pointsSchema = z.object({
  exactScore: z.coerce.number().int().min(0).max(100),
  result: z.coerce.number().int().min(0).max(100),
  champion: z.coerce.number().int().min(0).max(100),
  topScorer: z.coerce.number().int().min(0).max(100),
});

export const bolaoModesSchema = modesSchema;
export type BolaoModesInput = z.infer<typeof modesSchema>;

export const bolaoPointsSchema = pointsSchema;
export type BolaoPointsInput = z.infer<typeof pointsSchema>;

export const bolaoTiebreakerSchema = z.object({
  tiebreaker: z.enum(TIEBREAKER_OPTIONS),
});
export type BolaoTiebreakerInput = z.infer<typeof bolaoTiebreakerSchema>;

export const bolaoRulesSchema = z.object({
  modes: modesSchema,
  points: pointsSchema,
  tiebreaker: z.enum(TIEBREAKER_OPTIONS),
});
export type BolaoRulesInput = z.infer<typeof bolaoRulesSchema>;

export const bolaoCompetitionStepSchema = z.object({
  competitionId: z.string().uuid("competitionRequired"),
});
export type BolaoCompetitionStepInput = z.infer<typeof bolaoCompetitionStepSchema>;

export const bolaoFinalizeSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(100),
  description: z.string().trim().max(500).optional(),
});
export type BolaoFinalizeInput = z.infer<typeof bolaoFinalizeSchema>;

export const defaultWizardRules = DEFAULT_BOLAO_RULES;
