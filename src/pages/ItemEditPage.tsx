import { ArrowLeft, PackageSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { ItemForm } from '@/features/items/components';
import { useItem, useUpdateItem } from '@/features/items/hooks';
import { ItemDetailSkeleton } from '@/shared/components';

export default function ItemEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, error } = useItem(id ?? '');
  const updateMutation = useUpdateItem(id ?? '');

  if (isLoading) return <ItemDetailSkeleton />;

  if (error || !item) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
        <PackageSearch className="h-16 w-16 text-stone-300 dark:text-stone-600" />
        <p className="text-stone-500 dark:text-stone-400">{t('common.noResults')}</p>
        <Button variant="outline" render={<Link to="/" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-stone-900 dark:text-stone-50 md:text-[28px]">
          {t('items.editItem')}
        </h1>
        <p className="mt-1.5 text-[14px] text-stone-500 dark:text-stone-400">{item.title}</p>
      </div>

      <ItemForm item={item} onSubmit={updateMutation.mutate} isPending={updateMutation.isPending} />
    </div>
  );
}
