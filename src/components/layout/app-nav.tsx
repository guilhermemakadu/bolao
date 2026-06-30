import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/services/auth";
import { cn } from "@/lib/utils";

type AppNavProps = {
  dashboardLabel: string;
  settingsLabel: string;
  logoutLabel: string;
  currentPath: "/dashboard" | "/configuracoes";
};

export function AppNav({ dashboardLabel, settingsLabel, logoutLabel, currentPath }: AppNavProps) {
  const linkClass = (path: string) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      currentPath === path
        ? "bg-emerald-100 text-emerald-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    );

  return (
    <nav className="flex flex-wrap items-center gap-2">
      <Link href="/dashboard" className={linkClass("/dashboard")}>
        {dashboardLabel}
      </Link>
      <Link href="/configuracoes" className={linkClass("/configuracoes")}>
        {settingsLabel}
      </Link>
      <form action={signOutAction} className="ml-auto">
        <Button type="submit" variant="outline" size="sm">
          {logoutLabel}
        </Button>
      </form>
    </nav>
  );
}
