import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BolaoListSection } from "@/components/bolao/bolao-list-section";
import { BolaoStatusBadge } from "@/components/bolao/bolao-status-badge";
import { AppNav } from "@/components/layout/app-nav";
import { BOLAO_STATUSES } from "@/lib/bolao/status";
import { createClient } from "@/lib/supabase/server";
import { listUserBoloes } from "@/services/boloes";
import { getUserProfile } from "@/services/users";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const tBolao = await getTranslations("bolao");
  const tAuth = await getTranslations("auth");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getUserProfile(user.id);
  const displayName =
    profile?.name ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "";

  const { created, participating } = await listUserBoloes(user.id);

  const statusLabels = {
    DRAFT: tBolao("status.draft"),
    OPEN: tBolao("status.open"),
    IN_PROGRESS: tBolao("status.inProgress"),
    ARCHIVED: tBolao("status.archived"),
  } as const;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">{t("welcome", { name: displayName })}</p>
        </div>
        <AppNav
          dashboardLabel={t("nav.dashboard")}
          settingsLabel={t("nav.settings")}
          logoutLabel={tAuth("logout")}
          currentPath="/dashboard"
        />
      </header>

      <div className="space-y-8">
        <BolaoListSection
          title={t("sections.created")}
          emptyMessage={t("empty.created")}
          boloes={created}
          statusLabels={statusLabels}
        />

        <BolaoListSection
          title={t("sections.participating")}
          emptyMessage={t("empty.participating")}
          boloes={participating}
          statusLabels={statusLabels}
        />

        <section className="space-y-3" aria-label={tBolao("statusLegend")}>
          <h2 className="text-sm font-medium text-slate-500">{tBolao("statusLegend")}</h2>
          <div className="flex flex-wrap gap-2">
            {BOLAO_STATUSES.map((status) => (
              <BolaoStatusBadge key={status} status={status} label={statusLabels[status]} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
