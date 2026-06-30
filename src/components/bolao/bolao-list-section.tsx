import type { BolaoStatus } from "@/lib/bolao/status";
import type { BolaoSummary } from "@/components/bolao/bolao-card";
import { BolaoCard } from "@/components/bolao/bolao-card";

type BolaoListSectionProps = {
  title: string;
  emptyMessage: string;
  boloes: BolaoSummary[];
  statusLabels: Record<BolaoStatus, string>;
};

export function BolaoListSection({
  title,
  emptyMessage,
  boloes,
  statusLabels,
}: BolaoListSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {boloes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-600">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {boloes.map((bolao) => (
            <li key={bolao.id}>
              <BolaoCard bolao={bolao} statusLabel={statusLabels[bolao.status]} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
