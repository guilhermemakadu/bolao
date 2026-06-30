"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { LoginInput, SignupInput } from "@/lib/validators/auth";
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
