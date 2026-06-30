"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ProfileUpdateInput } from "@/lib/validators/profile";
import { getUserProfile, syncUserProfile, updateUserDisplayName } from "@/services/users";

export type ProfileActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateDisplayNameAction(
  input: ProfileUpdateInput,
): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "unauthorized" };
  }

  const trimmedName = input.name.trim();

  const existing = await getUserProfile(user.id);
  if (!existing) {
    await syncUserProfile(user.id, user.email ?? "", trimmedName);
  } else {
    await updateUserDisplayName(user.id, trimmedName);
  }

  const { error } = await supabase.auth.updateUser({
    data: { name: trimmedName },
  });

  if (error) {
    return { success: false, error: "updateError" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/configuracoes");

  return { success: true };
}
