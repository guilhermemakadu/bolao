import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockResetPasswordForEmail, mockUpdateUser, mockCreateClient } = vi.hoisted(() => ({
  mockResetPasswordForEmail: vi.fn(),
  mockUpdateUser: vi.fn(),
  mockCreateClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mockCreateClient,
}));

vi.mock("@/services/users", () => ({
  syncUserProfile: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name === "host") return "localhost:3000";
      if (name === "x-forwarded-proto") return "http";
      return null;
    },
  })),
}));

import { requestPasswordResetAction, updatePasswordAction } from "@/services/auth";

describe("requestPasswordResetAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateClient.mockResolvedValue({
      auth: { resetPasswordForEmail: mockResetPasswordForEmail },
    });
  });

  it("sends reset email with callback redirect URL", async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    const result = await requestPasswordResetAction({ email: "user@example.com" });

    expect(result).toEqual({ success: true });
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "http://localhost:3000/auth/callback?next=/redefinir-senha",
    });
  });

  it("returns error when Supabase fails", async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: { message: "rate limit" } });

    const result = await requestPasswordResetAction({ email: "user@example.com" });

    expect(result).toEqual({ success: false, error: "forgotPasswordError" });
  });
});

describe("updatePasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateClient.mockResolvedValue({
      auth: { updateUser: mockUpdateUser },
    });
  });

  it("updates the user password", async () => {
    mockUpdateUser.mockResolvedValue({ error: null });

    const result = await updatePasswordAction({
      password: "newpass1",
      confirmPassword: "newpass1",
    });

    expect(result).toEqual({ success: true });
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: "newpass1" });
  });

  it("returns error when Supabase fails", async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: "weak password" } });

    const result = await updatePasswordAction({
      password: "newpass1",
      confirmPassword: "newpass1",
    });

    expect(result).toEqual({ success: false, error: "updatePasswordError" });
  });
});
