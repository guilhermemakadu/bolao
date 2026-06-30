import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("invalidEmail"),
  password: z.string().min(1, "passwordRequired"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "nameRequired"),
  email: z.string().email("invalidEmail"),
  password: z.string().min(6, "passwordMin"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
