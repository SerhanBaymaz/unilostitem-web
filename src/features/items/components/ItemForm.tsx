import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AppMap } from '@/shared/components';
import type { ItemType } from '@/shared/types';
import { ITEM_CATEGORIES } from '@/shared/types';
import type { Item, ItemCreateRequest } from '../types';

const itemSchema = z.object({
  title: z.string().min(3, 'items.titleRequired'),
  description: z.string().min(10, 'items.descriptionRequired'),
  category: z.string().min(1, 'auth.required'),
  itemType: z.string().min(1, 'auth.required'),
  locationLabel: z.string().min(1, 'auth.required'),
  contactInfo: z.string().min(1, 'items.contactInfoRequired').max(300, 'items.contactInfoMax'),
  latitude: z.number({ required_error: 'auth.required' }),
  longitude: z.number({ required_error: 'auth.required' }),
});

type ItemFormData = z.infer<typeof itemSchema>;

export type SubmitPayload = ItemCreateRequest & { removeImage?: boolean };

interface ItemFormProps {
  item?: Item;
  onSubmit: (data: SubmitPayload) => void;
  isPending: boolean;
}

export function ItemForm({ item, onSubmit, isPending }: Readonly<ItemFormProps>) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(item?.imageUrl || null);
  const [removeImage, setRemoveImage] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: item
      ? {
          title: item.title,
          description: item.description,
          category: item.category,
          itemType: item.itemType,
          contactInfo: item.contactInfo,
          locationLabel: item.locationLabel ?? '',
          latitude: item.latitude,
          longitude: item.longitude,
        }
      : {
          title: '',
          description: '',
          category: '',
          itemType: '',
          contactInfo: '',
          locationLabel: '',
          latitude: undefined,
          longitude: undefined,
        },
  });

  const lat = watch('latitude');
  const lng = watch('longitude');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (data: ItemFormData) => {
    const payload: SubmitPayload = {
      ...data,
      incidentDate: item?.incidentDate || new Date().toISOString(),
      itemType: data.itemType as ItemType,
      category: data.category as ItemCreateRequest['category'],
    };

    if (selectedFile) {
      payload.image = selectedFile;
    }
    if (removeImage) {
      payload.removeImage = true;
    }

    onSubmit(payload);
  };

  const inputClass =
    'h-10 rounded-md border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 text-[15px] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20';

  const textareaClass =
    'rounded-md border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 text-[15px] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus-visible:border-amber-500 focus-visible:ring-amber-500/20';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-stone-700 dark:text-stone-300">
          {t('items.itemTitle')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t('items.titlePlaceholder')}
          aria-invalid={!!errors.title}
          className={inputClass}
          {...register('title')}
        />
        {errors.title?.message && (
          <p className="text-[13px] text-red-600">{t(errors.title.message)}</p>
        )}
      </div>

      {/* Type + Category Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-stone-700 dark:text-stone-300">
            {t('items.type')} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="itemType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  {field.value ? (
                    <SelectValue>{t(`items.${field.value.toLowerCase()}`)}</SelectValue>
                  ) : (
                    <SelectValue placeholder={t('items.type')} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lost">{t('items.lost')}</SelectItem>
                  <SelectItem value="Found">{t('items.found')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.itemType?.message && (
            <p className="text-[13px] text-red-600">{t(errors.itemType.message)}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-stone-700 dark:text-stone-300">
            {t('items.category')} <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  {field.value ? (
                    <SelectValue>{t(`categories.${field.value}`)}</SelectValue>
                  ) : (
                    <SelectValue placeholder={t('items.category')} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {ITEM_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category?.message && (
            <p className="text-[13px] text-red-600">{t(errors.category.message)}</p>
          )}
        </div>
      </div>

      {/* Map Selection */}
      <div className="space-y-1.5">
        <Label className="text-stone-700 dark:text-stone-300">
          {t('items.pickOnMap')} <span className="text-red-500">*</span>
        </Label>
        <AppMap
          center={lat && lng ? [lat, lng] : undefined}
          zoom={13}
          selectable
          onMapClick={(lat, lng) => {
            setValue('latitude', lat, { shouldValidate: true });
            setValue('longitude', lng, { shouldValidate: true });
          }}
          markers={
            lat && lng
              ? [
                  {
                    id: 'preview',
                    latitude: lat,
                    longitude: lng,
                    title: t('items.location'),
                    itemType: (watch('itemType') as ItemType) || 'Lost',
                  },
                ]
              : []
          }
        />
        {errors.latitude?.message && (
          <p className="text-[13px] text-red-600">{t(errors.latitude.message)}</p>
        )}
        <p className="text-[11px] text-stone-400 dark:text-stone-500">
          {t('items.locationHelp', 'Haritaya tıklayarak konumu belirleyin.')}
        </p>
      </div>

      {/* Location Label */}
      <div className="space-y-1.5">
        <Label htmlFor="locationLabel" className="text-stone-700 dark:text-stone-300">
          {t('items.location')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="locationLabel"
          placeholder={t('items.locationPlaceholder')}
          aria-invalid={!!errors.locationLabel}
          className={inputClass}
          {...register('locationLabel')}
        />
        {errors.locationLabel?.message && (
          <p className="text-[13px] text-red-600">{t(errors.locationLabel.message)}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-stone-700 dark:text-stone-300">
          {t('items.description')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder={t('items.descriptionPlaceholder')}
          rows={4}
          aria-invalid={!!errors.description}
          className={textareaClass}
          {...register('description')}
        />
        {errors.description?.message && (
          <p className="text-[13px] text-red-600">{t(errors.description.message)}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-1.5">
        <Label className="text-stone-700 dark:text-stone-300">{t('items.image')}</Label>

        {previewUrl ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-stone-200 shadow-sm dark:border-stone-800">
            <img
              src={previewUrl}
              alt="Preview"
              className="aspect-video h-auto w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-90 shadow-sm hover:opacity-100"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t('common.remove')}</span>
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 py-8 transition-colors hover:border-amber-500/50 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-amber-500/50 dark:hover:bg-stone-800/80"
          >
            <div className="rounded-full bg-stone-100 p-3 dark:bg-stone-800">
              <UploadCloud className="h-6 w-6 text-stone-500 dark:text-stone-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {t('items.clickToUpload')}
              </p>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                {t('items.imageHelp')}
              </p>
            </div>
          </button>
        )}
        <input
          id="imageFile"
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5">
        <Label htmlFor="contactInfo" className="text-stone-700 dark:text-stone-300">
          {t('items.contactInfo')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contactInfo"
          placeholder={t('items.contactPlaceholder')}
          aria-invalid={!!errors.contactInfo}
          className={inputClass}
          {...register('contactInfo')}
        />
        {errors.contactInfo?.message && (
          <p className="text-[13px] text-red-600">{t(errors.contactInfo.message)}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1" size="lg">
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}
