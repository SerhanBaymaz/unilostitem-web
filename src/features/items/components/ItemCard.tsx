import { Calendar, MapPin, MessageSquare, PackageSearch, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { CategoryBadge, ItemTypeBadge } from "@/shared/components";
import type { Item } from "../types";

interface ItemCardProps {
	item: Item;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export function ItemCard({ item }: ItemCardProps) {
	const { t } = useTranslation();

	return (
		<Link
			to={`/items/${item.id}`}
			className="group flex gap-4 rounded-xl border border-stone-100 bg-card p-4 shadow-warm-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm-2 active:scale-[0.99]"
		>
			{/* Image Wrapper */}
			<div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-stone-50 border border-stone-100/50">
				{item.imageUrl ? (
					<img
						src={item.imageUrl}
						alt={item.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<PackageSearch className="h-10 w-10 text-stone-200" />
					</div>
				)}
			</div>

			{/* Content Wrapper */}
			<div className="flex min-w-0 flex-1 flex-col py-0.5">
				{/* Top Row: Title & Type */}
				<div className="mb-1 flex items-start justify-between gap-3">
					<h3 className="truncate text-[16px] font-bold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
						{item.title}
					</h3>
					<ItemTypeBadge type={item.itemType} />
				</div>

				{/* Description: Subtle & Clamped */}
				{item.description && (
					<p className="mb-3 line-clamp-1 text-[13px] leading-relaxed text-stone-500 italic">
						{item.description}
					</p>
				)}

				{/* Meta Info Grid */}
				<div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 border-t border-stone-50 pt-3">
					<div className="flex items-center gap-2 text-[12px] text-stone-400">
						<Calendar className="h-3.5 w-3.5 shrink-0 text-stone-300" />
						<span className="truncate">{formatDate(item.incidentDate)}</span>
					</div>

					{item.locationLabel && (
						<div className="flex items-center gap-2 text-[12px] text-stone-400">
							<MapPin className="h-3.5 w-3.5 shrink-0 text-stone-300" />
							<span className="truncate">{item.locationLabel}</span>
						</div>
					)}

					<div className="flex items-center gap-2 text-[12px] text-stone-400">
						<User className="h-3.5 w-3.5 shrink-0 text-stone-300" />
						<span className="truncate font-medium text-stone-500">{item.ownerName}</span>
					</div>

					<div className="flex items-center gap-2 text-[12px] text-stone-400">
						<MessageSquare className="h-3.5 w-3.5 shrink-0 text-stone-300" />
						<span className="font-semibold text-amber-600/80">
							{item.claimCount || 0} {t("claims.title")}
						</span>
					</div>
				</div>

				{/* Category Badge */}
				<CategoryBadge category={item.category} className="mt-2 self-start" />
			</div>
		</Link>
	);
}
