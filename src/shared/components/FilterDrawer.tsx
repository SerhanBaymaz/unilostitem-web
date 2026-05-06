import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ITEM_CATEGORIES } from '@/shared/types';
import type { Category, ItemType } from '@/shared/types';

interface FilterDrawerProps {
  itemType?: ItemType;
  category?: Category;
  status?: string;
  onItemTypeChange?: (value: ItemType | undefined) => void;
  onCategoryChange?: (value: Category | undefined) => void;
  onStatusChange?: (value: string | undefined) => void;
  onReset?: () => void;
  className?: string;
}

const ITEM_STATUSES = ['Active', 'Resolved', 'Expired'] as const;

export function FilterDrawer({
  itemType,
  category,
  status,
  onItemTypeChange,
  onCategoryChange,
  onStatusChange,
  onReset,
  className,
}: FilterDrawerProps) {
  const { t } = useTranslation();

  const hasFilters = itemType || category || status;

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className={className} />}
      >
        <SlidersHorizontal className="mr-1.5 h-4 w-4" />
        {t('common.filter')}
        {hasFilters && (
          <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            !
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-w-lg rounded-t-xl bg-background">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl text-stone-900">
            {t('common.filter')}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 pb-4">
          {/* Item Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-stone-700">{t('items.type')}</Label>
            <Select
              value={itemType ?? 'all'}
              onValueChange={(v) => onItemTypeChange?.(v === 'all' ? undefined : (v as ItemType))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('items.allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('items.allTypes')}</SelectItem>
                <SelectItem value="Lost">{t('items.lost')}</SelectItem>
                <SelectItem value="Found">{t('items.found')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-stone-700">{t('items.category')}</Label>
            <Select
              value={category ?? 'all'}
              onValueChange={(v) => onCategoryChange?.(v === 'all' ? undefined : (v as Category))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('items.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('items.allCategories')}</SelectItem>
                {ITEM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-stone-700">{t('items.status')}</Label>
            <Select
              value={status ?? 'all'}
              onValueChange={(v) => onStatusChange?.(v === 'all' || v === null ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">—</SelectItem>
                {ITEM_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`items.${s.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="w-full text-text-secondary">
              Filtreleri Temizle
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
