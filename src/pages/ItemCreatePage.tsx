import { useTranslation } from 'react-i18next';
import { ItemForm } from '@/features/items/components';
import { useCreateItem } from '@/features/items/hooks';

export default function ItemCreatePage() {
  const { t } = useTranslation();
  const createMutation = useCreateItem();

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-stone-900 dark:text-stone-50 md:text-[28px]">
          {t('items.createTitle')}
        </h1>
        <p className="mt-1.5 text-[14px] text-stone-500 dark:text-stone-400">
          {t('items.createSubtitle')}
        </p>
      </div>

      <ItemForm onSubmit={createMutation.mutate} isPending={createMutation.isPending} />
    </div>
  );
}
