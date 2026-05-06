import { PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ItemCard } from "@/features/items/components";
import { useMyItems } from "@/features/items/hooks";
import { EmptyState, ItemCardSkeleton } from "@/shared/components";

export default function MyItemsPage() {
	const { t } = useTranslation();
	const { data, isLoading } = useMyItems({ pageNumber: 1, pageSize: 20 });

	return (
		<div className="mx-auto max-w-3xl p-4 md:p-6">
			<h1 className="mb-6 font-heading text-2xl text-stone-900 md:text-[28px]">
				{t("profile.myItems")}
			</h1>

			{isLoading ? (
				<div className="space-y-3">
					<ItemCardSkeleton />
					<ItemCardSkeleton />
					<ItemCardSkeleton />
				</div>
			) : !data?.items || data.items.length === 0 ? (
				<EmptyState
					icon={PackageSearch}
					message={t("profile.noItems")}
					subMessage={t("profile.noItemsSub")}
					actionLabel={t("items.addItem")}
					onAction={() => (window.location.href = "/items/new")}
				/>
			) : (
				<div className="space-y-3">
					{data.items.map((item) => (
						<ItemCard key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	);
}
