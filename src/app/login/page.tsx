import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const t = await getTranslations("common");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{t("appName")}</h1>
      </div>
      <LoginForm />
    </main>
  );
}
