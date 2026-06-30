import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

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
