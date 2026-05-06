import type { ItemType } from '@/shared/types';
import { useTranslation } from 'react-i18next';

const typeStyles: Record<ItemType, string> = {
  Lost: 'bg-rose-50 text-rose-700',
  Found: 'bg-emerald-50 text-emerald-700',
};

export function ItemTypeBadge({ type }: { type: ItemType }) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-sm px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ${typeStyles[type]}`}
    >
      {t(`items.${type.toLowerCase()}`)}
    </span>
  );
}
