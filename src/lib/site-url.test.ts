import { describe, expect, it } from "vitest";

import { buildPasswordResetRedirectUrl, buildSiteUrl } from "@/lib/site-url";

describe("buildSiteUrl", () => {
  it("combines protocol and host", () => {
    expect(buildSiteUrl("localhost:3000", "http")).toBe("http://localhost:3000");
  });
});

describe("buildPasswordResetRedirectUrl", () => {
  it("points to auth callback with redefinir-senha next path", () => {
    expect(buildPasswordResetRedirectUrl("https://bolao.example.com")).toBe(
      "https://bolao.example.com/auth/callback?next=/redefinir-senha",
    );
  });
});
