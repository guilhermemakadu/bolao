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

export const forgotPasswordSchema = z.object({
  email: z.string().email("invalidEmail"),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(6, "passwordMin"),
    confirmPassword: z.string().min(1, "passwordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
