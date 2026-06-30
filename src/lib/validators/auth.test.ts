import { describe, expect, it } from "vitest";

import { loginSchema, signupSchema } from "@/lib/validators/auth";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 6 characters", () => {
    const result = signupSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      password: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = signupSchema.safeParse({
      name: "",
      email: "maria@example.com",
      password: "123456",
    });

    expect(result.success).toBe(false);
  });
});
