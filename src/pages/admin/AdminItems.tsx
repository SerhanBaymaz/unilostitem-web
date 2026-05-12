import { PackageSearch, Search, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDeleteItem, useItems } from '@/features/items/hooks';
import type { Item, ItemListParams } from '@/features/items/types';
import { ItemStatusBadge, ItemTypeBadge, ListSkeleton, Pagination } from '@/shared/components';

const PAGE_SIZE = 20;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminItems() {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [params, setParams] = useState<ItemListParams>({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    sortBy: 'createdAt',
    sortDescending: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = useMemo<ItemListParams>(
    () => ({
      ...params,
      searchTerm: debouncedSearch || undefined,
    }),
    [params, debouncedSearch]
  );

  const { data, isLoading, isFetching } = useItems(queryParams);
  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-stone-900 md:text-[28px] dark:text-stone-50">
          {t('admin.items')}
        </h1>
        <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
          {t('admin.itemsSubtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
        <Input
          ref={searchInputRef}
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setParams((prev) => ({ ...prev, pageNumber: 1 }));
          }}
          className="h-9 max-w-sm pl-9 text-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setParams((prev) => ({ ...prev, pageNumber: 1 }));
              searchInputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:text-stone-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Items Table */}
      {isLoading ? (
        <ListSkeleton count={6} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <PackageSearch
            className="mb-4 h-12 w-12 text-stone-300 dark:text-stone-600"
            strokeWidth={1.5}
          />
          <p className="text-base text-stone-500 dark:text-stone-400">{t('admin.noItems')}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50 dark:border-stone-700 dark:bg-stone-900/50">
                  <th className="px-4 py-3 font-medium text-stone-500 dark:text-stone-400">
                    {t('items.itemTitle')}
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-stone-500 md:table-cell dark:text-stone-400">
                    {t('items.type')}
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-stone-500 md:table-cell dark:text-stone-400">
                    {t('items.status')}
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-stone-500 sm:table-cell dark:text-stone-400">
                    {t('items.category')}
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-stone-500 lg:table-cell dark:text-stone-400">
                    {t('items.location')}
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-stone-500 lg:table-cell dark:text-stone-400">
                    {t('items.createdAt')}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-stone-500 dark:text-stone-400">
                    {' '}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <AdminItemRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>

          {isFetching && <ListSkeleton count={2} />}

          {pagination && (
            <Pagination
              currentPage={pagination.pageNumber}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-4"
            />
          )}
        </>
      )}
    </div>
  );
}

function AdminItemRow({ item }: Readonly<{ item: Item }>) {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMutation = useDeleteItem();

  const handleDelete = () => {
    deleteMutation.mutate(item.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <tr className="border-b border-stone-100 transition-colors hover:bg-stone-50/50 dark:border-stone-800 dark:hover:bg-stone-800/50">
        <td className="px-4 py-3">
          <Link to={`/items/${item.id}`} className="flex items-center gap-3 group">
            <div className="aspect-square h-9 w-9 shrink-0 overflow-hidden rounded-md bg-stone-100 dark:bg-stone-800">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <PackageSearch className="h-4 w-4 text-stone-300 dark:text-stone-600" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-stone-900 group-hover:text-amber-600 dark:text-stone-50">
                {item.title}
              </p>
              <p className="truncate text-[12px] text-stone-400 md:hidden dark:text-stone-500">
                {item.category}
              </p>
            </div>
          </Link>
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <ItemTypeBadge type={item.itemType} />
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <ItemStatusBadge status={item.status} />
        </td>
        <td className="hidden px-4 py-3 text-stone-500 sm:table-cell dark:text-stone-400">
          {item.category}
        </td>
        <td className="hidden px-4 py-3 text-stone-500 lg:table-cell dark:text-stone-400">
          {item.locationLabel ?? '—'}
        </td>
        <td className="hidden px-4 py-3 text-[13px] text-stone-400 lg:table-cell dark:text-stone-500">
          {formatDate(item.createdAt)}
        </td>
        <td className="px-4 py-3 text-right">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-stone-400 hover:text-red-600 dark:text-stone-500"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('items.deleteItem')}</DialogTitle>
            <DialogDescription>{t('items.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>{t('common.cancel')}</DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
