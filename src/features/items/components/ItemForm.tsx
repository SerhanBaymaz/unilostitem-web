import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ItemType } from "@/shared/types";
import { ITEM_CATEGORIES } from "@/shared/types";
import type { Item, ItemCreateRequest } from "../types";

const itemSchema = z.object({
	title: z.string().min(3, "items.titleRequired"),
	description: z.string().min(10, "items.descriptionRequired"),
	category: z.string().min(1, "auth.required"),
	itemType: z.string().min(1, "auth.required"),
	incidentDate: z.string().min(1, "auth.required"),
	locationLabel: z.string().min(1, "auth.required"),
	imageUrl: z.string().optional(),
	contactInfo: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
	item?: Item;
	onSubmit: (data: ItemCreateRequest) => void;
	isPending: boolean;
}

export function ItemForm({ item, onSubmit, isPending }: ItemFormProps) {
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ItemFormData>({
		resolver: zodResolver(itemSchema),
		defaultValues: item
			? {
					title: item.title,
					description: item.description,
					category: item.category,
					itemType: item.itemType,
					incidentDate: item.incidentDate.split("T")[0],
					imageUrl: item.imageUrl ?? "",
					contactInfo: item.contactInfo ?? "",
					locationLabel: item.locationLabel ?? "",
				}
			: {
					title: "",
					description: "",
					category: "",
					itemType: "",
					incidentDate: new Date().toISOString().split("T")[0],
					imageUrl: "",
					contactInfo: "",
					locationLabel: "",
				},
	});

	const handleFormSubmit = (data: ItemFormData) => {
		const payload: ItemCreateRequest = {
			...data,
			imageUrl: data.imageUrl || undefined,
			contactInfo: data.contactInfo || undefined,
			itemType: data.itemType as ItemType,
			category: data.category as ItemCreateRequest["category"],
		};
		onSubmit(payload);
	};

	const inputClass =
		"h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20";

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
			{/* Title */}
			<div className="space-y-1.5">
				<Label htmlFor="title" className="text-stone-700">
					{t("items.itemTitle")}
				</Label>
				<Input
					id="title"
					placeholder="Örn: Siyah Laptop Çantası"
					aria-invalid={!!errors.title}
					className={inputClass}
					{...register("title")}
				/>
				{errors.title?.message && (
					<p className="text-[13px] text-red-600">{t(errors.title.message)}</p>
				)}
			</div>

			{/* Type + Category Row */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label className="text-stone-700">{t("items.type")}</Label>
					<Controller
						name="itemType"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder={t("items.type")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Lost">{t("items.lost")}</SelectItem>
									<SelectItem value="Found">{t("items.found")}</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.itemType?.message && (
						<p className="text-[13px] text-red-600">{t(errors.itemType.message)}</p>
					)}
				</div>

				<div className="space-y-1.5">
					<Label className="text-stone-700">{t("items.category")}</Label>
					<Controller
						name="category"
						control={control}
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder={t("items.category")} />
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

			{/* Incident Date */}
			<div className="space-y-1.5">
				<Label htmlFor="incidentDate" className="text-stone-700">
					{t("items.incidentDate")}
				</Label>
				<Input
					id="incidentDate"
					type="date"
					aria-invalid={!!errors.incidentDate}
					className={inputClass}
					{...register("incidentDate")}
				/>
				{errors.incidentDate?.message && (
					<p className="text-[13px] text-red-600">{t(errors.incidentDate.message)}</p>
				)}
			</div>

			{/* Location Label */}
			<div className="space-y-1.5">
				<Label htmlFor="locationLabel" className="text-stone-700">
					{t("items.location")}
				</Label>
				<Input
					id="locationLabel"
					placeholder={t("items.locationPlaceholder")}
					aria-invalid={!!errors.locationLabel}
					className={inputClass}
					{...register("locationLabel")}
				/>
				{errors.locationLabel?.message && (
					<p className="text-[13px] text-red-600">{t(errors.locationLabel.message)}</p>
				)}
			</div>

			{/* Description */}
			<div className="space-y-1.5">
				<Label htmlFor="description" className="text-stone-700">
					{t("items.description")}
				</Label>
				<Textarea
					id="description"
					placeholder="Eşyanın fiziksel özelliklerini, marka/model bilgisini, kaybolduğu/bulunduğu koşulları açıklayın..."
					rows={4}
					aria-invalid={!!errors.description}
					className="rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
					{...register("description")}
				/>
				{errors.description?.message && (
					<p className="text-[13px] text-red-600">{t(errors.description.message)}</p>
				)}
			</div>

			{/* Image URL */}
			<div className="space-y-1.5">
				<Label htmlFor="imageUrl" className="text-stone-700">
					{t("items.image")}
				</Label>
				<Input
					id="imageUrl"
					type="url"
					placeholder={t("items.imagePlaceholder")}
					className={inputClass}
					{...register("imageUrl")}
				/>
			</div>

			{/* Contact Info */}
			<div className="space-y-1.5">
				<Label htmlFor="contactInfo" className="text-stone-700">
					{t("items.contactInfo")}
				</Label>
				<Input
					id="contactInfo"
					placeholder={t("items.contactPlaceholder")}
					className={inputClass}
					{...register("contactInfo")}
				/>
			</div>

			{/* Submit */}
			<div className="flex gap-3 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1" size="lg">
					{t("common.save")}
				</Button>
			</div>
		</form>
	);
}
