"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema, type SignupInput } from "@/lib/validators/auth";
import { signUpAction } from "@/services/auth";

export function SignupForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupInput) {
    setError(null);
    const result = await signUpAction(data);

    if (!result.success) {
      setError(t(result.error as "signupError"));
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("signupTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" autoComplete="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600">{t(errors.name.message as "nameRequired")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-600">{t(errors.email.message as "invalidEmail")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{t(errors.password.message as "passwordMin")}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {t("signupButton")}
          </Button>

          <p className="text-center text-sm text-slate-600">
            {t("hasAccount")}{" "}
            <Link href="/login" className="font-medium text-emerald-700 hover:underline">
              {t("loginLink")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
