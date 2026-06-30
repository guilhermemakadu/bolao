import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
  updatePasswordSchema,
} from "@/lib/validators/auth";

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

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "user@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });
});

describe("updatePasswordSchema", () => {
  it("accepts matching passwords with at least 6 characters", () => {
    const result = updatePasswordSchema.safeParse({
      password: "123456",
      confirmPassword: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = updatePasswordSchema.safeParse({
      password: "123456",
      confirmPassword: "654321",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("passwordMismatch");
    }
  });

  it("rejects password shorter than 6 characters", () => {
    const result = updatePasswordSchema.safeParse({
      password: "12345",
      confirmPassword: "12345",
    });

    expect(result.success).toBe(false);
  });
});
