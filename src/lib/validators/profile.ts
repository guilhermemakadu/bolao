import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1, "nameRequired"),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
