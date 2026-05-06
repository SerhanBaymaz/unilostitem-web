import type { LucideIcon } from "lucide-react";
import {
	BookText,
	CreditCard,
	FileText,
	Key,
	MoreHorizontal,
	Shirt,
	ShoppingBag,
	Smartphone,
	Stethoscope,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Category } from "@/shared/types";

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
	Electronics: Smartphone,
	IdentificationCard: CreditCard,
	BagWallet: ShoppingBag,
	ClothingAccessory: Shirt,
	BookStationery: BookText,
	Key: Key,
	Documents: FileText,
	HealthMedical: Stethoscope,
	Other: MoreHorizontal,
};

interface CategoryBadgeProps {
	category: Category;
	className?: string;
	iconClassName?: string;
	showIcon?: boolean;
}

export function CategoryBadge({
	category,
	className = "",
	iconClassName = "h-3 w-3",
	showIcon = true,
}: CategoryBadgeProps) {
	const { t } = useTranslation();
	const Icon = CATEGORY_ICONS[category] || MoreHorizontal;

	return (
		<div
			className={`inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border border-stone-100 ${className}`}
		>
			{showIcon && <Icon className={iconClassName} />}
			<span>{t(`categories.${category}`)}</span>
		</div>
	);
}
