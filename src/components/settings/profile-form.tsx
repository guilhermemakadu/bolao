"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validators/profile";
import { updateDisplayNameAction } from "@/services/profile";

type ProfileFormProps = {
  initialName: string;
};

export function ProfileForm({ initialName }: ProfileFormProps) {
  const t = useTranslations("settings");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { name: initialName },
  });

  async function onSubmit(data: ProfileUpdateInput) {
    setError(null);
    setSuccess(false);

    const result = await updateDisplayNameAction(data);

    if (!result.success) {
      setError(t(result.error as "updateError"));
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{tAuth("name")}</Label>
            <Input id="name" autoComplete="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600">{tAuth(errors.name.message as "nameRequired")}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-700">{t("success")}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
