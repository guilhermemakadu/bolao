import { describe, expect, it } from "vitest";

import { profileUpdateSchema } from "@/lib/validators/profile";

describe("profileUpdateSchema", () => {
  it("accepts a non-empty display name", () => {
    const result = profileUpdateSchema.safeParse({ name: "Maria Silva" });
    expect(result.success).toBe(true);
  });

  it("rejects empty display name", () => {
    const result = profileUpdateSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only display name", () => {
    const result = profileUpdateSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
  });
});
