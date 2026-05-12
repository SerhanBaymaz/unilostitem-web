import { useTranslation } from 'react-i18next';
import type { ClaimStatus } from '@/shared/types';

const statusStyles: Record<ClaimStatus, string> = {
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  ApprovedByOwner: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  ApprovedByAdmin: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  RejectedByOwner: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  RejectedByAdmin: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  Cancelled: 'bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400',
};

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-sm px-3 py-0.5 text-xs font-semibold tracking-wide ${statusStyles[status]}`}
    >
      {t(`claims.${status.toLowerCase()}`)}
    </span>
  );
}
