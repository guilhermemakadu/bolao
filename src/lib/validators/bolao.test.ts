import { describe, expect, it } from "vitest";

import { DEFAULT_BOLAO_RULES, hasAtLeastOneMode, isValidBolaoRules } from "@/lib/bolao/rules";
import { bolaoModesSchema, bolaoRulesSchema } from "@/lib/validators/bolao";

describe("bolao rules", () => {
  it("validates default rules structure", () => {
    expect(isValidBolaoRules(DEFAULT_BOLAO_RULES)).toBe(true);
  });

  it("requires at least one active mode", () => {
    expect(hasAtLeastOneMode(DEFAULT_BOLAO_RULES.modes)).toBe(true);
    expect(
      hasAtLeastOneMode({ exactScore: false, result: false, tournamentExtras: false }),
    ).toBe(false);
  });
});

describe("bolaoModesSchema", () => {
  it("rejects when no mode is selected", () => {
    const result = bolaoModesSchema.safeParse({
      exactScore: false,
      result: false,
      tournamentExtras: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("bolaoRulesSchema", () => {
  it("accepts complete rules payload", () => {
    const result = bolaoRulesSchema.safeParse(DEFAULT_BOLAO_RULES);
    expect(result.success).toBe(true);
  });
});
