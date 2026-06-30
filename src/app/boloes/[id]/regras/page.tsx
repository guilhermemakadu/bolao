import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BolaoRulesForm } from "@/components/bolao/bolao-rules-form";
import { AppNav } from "@/components/layout/app-nav";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getBolaoById } from "@/services/boloes";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BolaoRegrasPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("bolaoRules");
  const tDashboard = await getTranslations("dashboard");
  const tAuth = await getTranslations("auth");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const pool = await getBolaoById(id, user.id);
  if (!pool || pool.creatorId !== user.id) {
    notFound();
  }

  if (pool.status !== "OPEN" && pool.status !== "DRAFT") {
    redirect("/dashboard");
  }

  if (pool.status === "DRAFT") {
    redirect(`/boloes/novo?poolId=${pool.id}`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6 sm:py-8">
      <header className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{t("pageTitle")}</h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">{t("back")}</Link>
          </Button>
        </div>
        <AppNav
          dashboardLabel={tDashboard("nav.dashboard")}
          settingsLabel={tDashboard("nav.settings")}
          logoutLabel={tAuth("logout")}
          currentPath="/dashboard"
        />
      </header>

      <BolaoRulesForm
        poolId={pool.id}
        poolName={pool.name}
        initialRules={pool.rulesJson}
        canDelete
      />
    </main>
  );
}
