import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Circle, Clock, Flag, SlidersHorizontal, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Category, ItemType } from '@/shared/types';
import { ITEM_CATEGORIES } from '@/shared/types';
import { CATEGORY_ICONS } from './CategoryBadge';

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

const ITEM_STATUSES = ['Active', 'Resolved', 'PendingApproval', 'Rejected', 'Flagged'] as const;

const STATUS_ICONS: Record<string, LucideIcon> = {
  Active: Circle,
  Resolved: CheckCircle2,
  PendingApproval: Clock,
  Rejected: XCircle,
  Flagged: Flag,
};

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

  const activeFiltersCount = [itemType, category, status].filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" className={`h-9 ${className}`} />}>
        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
        {t('common.filter')}
        {activeFiltersCount > 0 && (
          <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-lg rounded-t-2xl bg-background p-0 outline-none"
      >
        <div className="flex flex-col h-full max-h-[85svh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-stone-800">
            <SheetHeader>
              <SheetTitle className="text-left font-heading text-xl text-stone-900 dark:text-stone-50">
                {t('common.filter')}
              </SheetTitle>
            </SheetHeader>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 text-xs font-semibold text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/50 dark:hover:text-amber-400"
              >
                {t('common.resetFilters')}
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-10">
            {/* Item Type - Modern Toggle */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {t('items.type')}
              </Label>
              <div className="flex gap-2">
                {[undefined, 'Lost', 'Found'].map((type) => (
                  <Button
                    key={type || 'all'}
                    variant={itemType === type ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-10 rounded-xl transition-all"
                    onClick={() => onItemTypeChange?.(type as ItemType | undefined)}
                  >
                    {type ? t(`items.${(type as string).toLowerCase()}`) : t('items.allTypes')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category - Grid with Icons */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {t('items.category')}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {ITEM_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat];
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onCategoryChange?.(isSelected ? undefined : cat)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all ${
                        isSelected
                          ? 'border-primary bg-amber-50/50 ring-1 ring-primary dark:bg-amber-950/50'
                          : 'border-stone-100 bg-stone-50/50 hover:border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-800/50 dark:hover:border-stone-700 dark:hover:bg-stone-800'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-stone-400 dark:text-stone-500'}`}
                      />
                      <span
                        className={`text-[11px] font-medium leading-tight ${isSelected ? 'text-stone-900 dark:text-stone-50' : 'text-stone-500 dark:text-stone-400'}`}
                      >
                        {t(`categories.${cat}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status - Modern Grid */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {t('items.status')}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onStatusChange?.(undefined)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all text-sm ${
                    !status
                      ? 'border-primary bg-amber-50/50 ring-1 ring-primary text-stone-900 font-semibold dark:bg-amber-950/50 dark:text-stone-50'
                      : 'border-stone-100 bg-stone-50/50 hover:border-stone-200 hover:bg-stone-50 text-stone-500 dark:border-stone-800 dark:bg-stone-800/50 dark:hover:border-stone-700 dark:hover:bg-stone-800 dark:text-stone-400'
                  }`}
                >
                  <span className="h-4 w-4 shrink-0 rounded-full border-2 border-current opacity-20" />
                  {t('items.allTypes') || 'Tümü'}
                </button>
                {ITEM_STATUSES.map((s) => {
                  const Icon = STATUS_ICONS[s] || Circle;
                  const isSelected = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onStatusChange?.(isSelected ? undefined : s)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all text-sm ${
                        isSelected
                          ? 'border-primary bg-amber-50/50 ring-1 ring-primary text-stone-900 font-semibold dark:bg-amber-950/50 dark:text-stone-50'
                          : 'border-stone-100 bg-stone-50/50 hover:border-stone-200 hover:bg-stone-50 text-stone-500 dark:border-stone-800 dark:bg-stone-800/50 dark:hover:border-stone-700 dark:hover:bg-stone-800 dark:text-stone-400'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary' : 'text-stone-400 dark:text-stone-500'}`}
                      />
                      <span className="truncate">{t(`items.${s.toLowerCase()}`)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="border-t border-stone-100 p-4 bg-white md:hidden dark:border-stone-800 dark:bg-card">
            <SheetTrigger render={<Button className="w-full h-11 rounded-xl" />}>
              {t('common.confirm') || 'Uygula'}
            </SheetTrigger>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
