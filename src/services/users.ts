import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, type User } from "@/db/schema";

export async function syncUserProfile(
  userId: string,
  email: string,
  name?: string | null,
) {
  const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({
      id: userId,
      email,
      name: name ?? null,
    });
    return;
  }

  if (name && existing[0].name !== name) {
    await db.update(users).set({ name }).where(eq(users.id, userId));
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return rows[0] ?? null;
}

export async function updateUserDisplayName(userId: string, name: string): Promise<void> {
  const trimmed = name.trim();
  await db.update(users).set({ name: trimmed }).where(eq(users.id, userId));
}
