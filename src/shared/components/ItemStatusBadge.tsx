import { useTranslation } from 'react-i18next';
import type { ItemStatus } from '@/shared/types';

const statusStyles: Record<ItemStatus, string> = {
  PendingApproval: 'bg-amber-50 text-amber-700',
  Active: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-red-50 text-red-700',
  Resolved: 'bg-blue-50 text-blue-700',
  Flagged: 'bg-orange-50 text-orange-700',
};

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-sm px-3 py-0.5 text-xs font-semibold tracking-wide ${statusStyles[status]}`}
    >
      {t(`items.${status.toLowerCase()}`)}
    </span>
  );
}
