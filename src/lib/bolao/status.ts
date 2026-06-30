export const BOLAO_STATUSES = ["DRAFT", "OPEN", "IN_PROGRESS", "ARCHIVED"] as const;

export type BolaoStatus = (typeof BOLAO_STATUSES)[number];

const STATUS_LABEL_KEYS: Record<BolaoStatus, string> = {
  DRAFT: "bolao.status.draft",
  OPEN: "bolao.status.open",
  IN_PROGRESS: "bolao.status.inProgress",
  ARCHIVED: "bolao.status.archived",
};

export function getBolaoStatusLabelKey(status: BolaoStatus): string {
  return STATUS_LABEL_KEYS[status];
}

export function getBolaoStatusBadgeClass(status: BolaoStatus): string {
  switch (status) {
    case "DRAFT":
      return "bg-slate-100 text-slate-700";
    case "OPEN":
      return "bg-emerald-100 text-emerald-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "ARCHIVED":
      return "bg-amber-100 text-amber-800";
  }
}
