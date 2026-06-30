import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BolaoWizard } from "@/components/bolao/bolao-wizard";
import { AppNav } from "@/components/layout/app-nav";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getBolaoById, listCompetitions } from "@/services/boloes";

type PageProps = {
  searchParams: Promise<{ poolId?: string }>;
};

export default async function NovoBolaoPage({ searchParams }: PageProps) {
  const t = await getTranslations("wizard");
  const tDashboard = await getTranslations("dashboard");
  const tAuth = await getTranslations("auth");
  const { poolId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const competitions = await listCompetitions();
  let initialPoolId: string | undefined;
  let initialRules;

  if (poolId) {
    const pool = await getBolaoById(poolId, user.id);
    if (!pool || pool.creatorId !== user.id || pool.status !== "DRAFT") {
      redirect("/boloes/novo");
    }
    initialPoolId = pool.id;
    initialRules = pool.rulesJson;
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-6 sm:py-8">
      <header className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{t("pageTitle")}</h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">{t("cancel")}</Link>
          </Button>
        </div>
        <AppNav
          dashboardLabel={tDashboard("nav.dashboard")}
          settingsLabel={tDashboard("nav.settings")}
          logoutLabel={tAuth("logout")}
          currentPath="/dashboard"
        />
      </header>

      <BolaoWizard
        competitions={competitions}
        initialPoolId={initialPoolId}
        initialRules={initialRules}
      />
    </main>
  );
}
