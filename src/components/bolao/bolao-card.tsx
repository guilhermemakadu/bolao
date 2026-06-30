import Link from "next/link";

import type { BolaoStatus } from "@/lib/bolao/status";
import { BolaoStatusBadge } from "@/components/bolao/bolao-status-badge";

export type BolaoSummary = {
  id: string;
  name: string;
  status: BolaoStatus;
};

type BolaoCardProps = {
  bolao: BolaoSummary;
  statusLabel: string;
};

function getBolaoHref(bolao: BolaoSummary): string {
  if (bolao.status === "DRAFT") {
    return `/boloes/novo?poolId=${bolao.id}`;
  }
  if (bolao.status === "OPEN") {
    return `/boloes/${bolao.id}/regras`;
  }
  return `/dashboard`;
}

export function BolaoCard({ bolao, statusLabel }: BolaoCardProps) {
  return (
    <Link href={getBolaoHref(bolao)} className="block">
      <article className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40">
        <h3 className="min-w-0 flex-1 truncate font-medium text-slate-900">{bolao.name}</h3>
        <BolaoStatusBadge status={bolao.status} label={statusLabel} />
      </article>
    </Link>
  );
}
