import { useTranslation } from "react-i18next";
import type { ItemType } from "@/shared/types";

const typeStyles: Record<ItemType, string> = {
	Lost: "bg-violet-200 text-violet-900",
	Found: "bg-cyan-200 text-cyan-900",
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
