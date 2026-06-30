import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AppNav } from "@/components/layout/app-nav";
import { ProfileForm } from "@/components/settings/profile-form";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/services/users";

export default async function SettingsPage() {
  const t = await getTranslations("settings");
  const tDashboard = await getTranslations("dashboard");
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

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:py-8">
      <header className="mb-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("pageTitle")}</h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">{t("description")}</p>
        </div>
        <AppNav
          dashboardLabel={tDashboard("nav.dashboard")}
          settingsLabel={tDashboard("nav.settings")}
          logoutLabel={tAuth("logout")}
          currentPath="/configuracoes"
        />
      </header>

      <ProfileForm initialName={displayName} />
    </main>
  );
}
