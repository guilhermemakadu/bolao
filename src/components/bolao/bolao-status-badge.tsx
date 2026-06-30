import type { BolaoStatus } from "@/lib/bolao/status";
import { getBolaoStatusBadgeClass } from "@/lib/bolao/status";
import { cn } from "@/lib/utils";

type BolaoStatusBadgeProps = {
  status: BolaoStatus;
  label: string;
  className?: string;
};

export function BolaoStatusBadge({ status, label, className }: BolaoStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getBolaoStatusBadgeClass(status),
        className,
      )}
    >
      {label}
    </span>
  );
}
