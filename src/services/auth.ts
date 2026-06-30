"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { buildPasswordResetRedirectUrl, buildSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";
import type {
  ForgotPasswordInput,
  LoginInput,
  SignupInput,
  UpdatePasswordInput,
} from "@/lib/validators/auth";
import { syncUserProfile } from "@/services/users";

export type AuthActionResult =
  | { success: true }
  | { success: false; error: string };

export async function signUpAction(input: SignupInput): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { name: input.name },
    },
  });

  if (error || !data.user) {
    return { success: false, error: "signupError" };
  }

  await syncUserProfile(data.user.id, input.email, input.name);

  return { success: true };
}

export async function signInAction(input: LoginInput): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user) {
    return { success: false, error: "loginError" };
  }

  const name = (data.user.user_metadata?.name as string | undefined) ?? null;
  await syncUserProfile(data.user.id, data.user.email ?? input.email, name);

  return { success: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function getSiteUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  return buildSiteUrl(host, protocol);
}

export async function requestPasswordResetAction(
  input: ForgotPasswordInput,
): Promise<AuthActionResult> {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: buildPasswordResetRedirectUrl(siteUrl),
  });

  if (error) {
    return { success: false, error: "forgotPasswordError" };
  }

  return { success: true };
}

export async function updatePasswordAction(
  input: UpdatePasswordInput,
): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: input.password,
  });

  if (error) {
    return { success: false, error: "updatePasswordError" };
  }

  return { success: true };
}
