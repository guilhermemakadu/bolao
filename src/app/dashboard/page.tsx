import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/services/auth";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0] ?? "";

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-slate-600">{t("welcome", { name: displayName })}</p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            {(await getTranslations("auth"))("logout")}
          </Button>
        </form>
      </header>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        {t("empty")}
      </section>

      <footer className="mt-8">
        <Link href="/configuracoes" className="text-sm font-medium text-emerald-700 hover:underline">
          {t("settings")}
        </Link>
      </footer>
    </main>
  );
}
