import { Calendar, MapPin, PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ItemTypeBadge } from "@/shared/components";
import type { Item } from "../types";

interface ItemCardProps {
	item: Item;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export function ItemCard({ item }: ItemCardProps) {
	const { t } = useTranslation();

	return (
		<Link
			to={`/items/${item.id}`}
			className="group flex gap-4 rounded-lg border border-stone-100 bg-card p-4 shadow-warm-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm-2"
		>
			{/* Image */}
			<div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-stone-100">
				{item.imageUrl ? (
					<img
						src={item.imageUrl}
						alt={item.title}
						className="h-full w-full object-cover"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<PackageSearch className="h-8 w-8 text-stone-300" />
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<div className="flex items-start justify-between gap-2">
					<h3 className="truncate text-sm font-semibold text-stone-900">{item.title}</h3>
					<ItemTypeBadge type={item.itemType} />
				</div>

				{item.description && (
					<p className="line-clamp-2 text-[13px] leading-relaxed text-stone-500">
						{item.description}
					</p>
				)}

				<div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-stone-400">
					{item.locationLabel && (
						<span className="flex items-center gap-1">
							<MapPin className="h-3 w-3" />
							{item.locationLabel}
						</span>
					)}
					<span className="flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						{formatDate(item.incidentDate)}
					</span>
					<span className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-500">
						{t(`categories.${item.category}`)}
					</span>
				</div>
			</div>
		</Link>
	);
}
