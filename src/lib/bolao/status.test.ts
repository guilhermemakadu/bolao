import { describe, expect, it } from "vitest";

import { BOLAO_STATUSES, getBolaoStatusLabelKey } from "@/lib/bolao/status";

describe("getBolaoStatusLabelKey", () => {
  it.each([
    ["DRAFT", "draft"],
    ["OPEN", "open"],
    ["IN_PROGRESS", "inProgress"],
    ["ARCHIVED", "archived"],
  ] as const)("maps %s to bolao.status.%s", (status, labelKey) => {
    expect(getBolaoStatusLabelKey(status)).toBe(`bolao.status.${labelKey}`);
  });

  it("covers all defined statuses", () => {
    for (const status of BOLAO_STATUSES) {
      expect(getBolaoStatusLabelKey(status)).toMatch(/^bolao\.status\./);
    }
  });
});
