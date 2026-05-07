import { ChevronDown, ChevronUp, PackageSearch, Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ItemCard } from "@/features/items/components";
import { useItems } from "@/features/items/hooks";
import type { Item, ItemListParams } from "@/features/items/types";
import {
	AppMap,
	EmptyState,
	FilterDrawer,
	ItemCardSkeleton,
	type MapMarkerData,
	Pagination,
} from "@/shared/components";

const PAGE_SIZE = 12;

export default function HomePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthStore();
	const searchInputRef = useRef<HTMLInputElement>(null);

	const [params, setParams] = useState<ItemListParams>({
		pageNumber: 1,
		pageSize: PAGE_SIZE,
		sortBy: "createdAt",
		sortDescending: true,
		status: "Active",
	});

	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	const queryParams = useMemo<ItemListParams>(
		() => ({
			...params,
			searchTerm: debouncedSearch || undefined,
		}),
		[params, debouncedSearch],
	);

	const { data, isLoading, isFetching } = useItems(queryParams);
	const [sheetExpanded, setSheetExpanded] = useState(false);
	const sheetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchTerm), 350);
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const handlePageChange = useCallback((page: number) => {
		setParams((prev) => ({ ...prev, pageNumber: page }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const handleFilterChange = useCallback((key: keyof ItemListParams, value: string | undefined) => {
		setParams((prev) => ({
			...prev,
			pageNumber: 1,
			[key]: value || undefined,
		}));
	}, []);

	const handleResetFilters = useCallback(() => {
		setSearchTerm("");
		setParams({
			pageNumber: 1,
			pageSize: PAGE_SIZE,
			sortBy: "createdAt",
			sortDescending: true,
			status: "Active",
		});
		searchInputRef.current?.focus();
	}, []);

	const mapMarkers = useMemo<MapMarkerData[]>(
		() =>
			(data?.items ?? [])
				.filter(
					(item): item is Item & { latitude: number; longitude: number } =>
						item.latitude != null && item.longitude != null,
				)
				.map((item) => ({
					id: item.id,
					latitude: item.latitude,
					longitude: item.longitude,
					title: item.title,
					itemType: item.itemType,
					onClick: () => navigate(`/items/${item.id}`),
				})),
		[data?.items, navigate],
	);

	const hasFilters = params.itemType || params.category || params.status !== "Active" || searchTerm;

	return (
		<div className="flex flex-col md:h-[calc(100svh-60px)] md:flex-row">
			{/* ===== Map (full on mobile, 55% on desktop) ===== */}
			<div className="relative h-[45svh] shrink-0 md:h-full md:w-[55%]">
				<AppMap markers={mapMarkers} className="h-full w-full" />
			</div>

			{/* ===== Items Panel ===== */}
			<div
				ref={sheetRef}
				className="flex flex-1 flex-col border-t border-stone-200 bg-background dark:border-stone-700 md:h-full md:w-[45%] md:border-l md:border-t-0 md:overflow-y-auto"
			>
				{/* Drag Handle (mobile only) */}
				<button
					type="button"
					onClick={() => setSheetExpanded(!sheetExpanded)}
					className="flex items-center justify-center gap-1 border-b border-stone-100 py-2 dark:border-stone-800 md:hidden"
				>
					<div className="h-1 w-8 rounded-full bg-stone-300 dark:bg-stone-600" />
					{sheetExpanded ? (
						<ChevronDown className="absolute h-4 w-4 text-stone-400 dark:text-stone-500" />
					) : (
						<ChevronUp className="absolute h-4 w-4 text-stone-400 dark:text-stone-500" />
					)}
				</button>

				{/* Panel Header */}
				<div className="flex flex-col border-b border-stone-100 dark:border-stone-800 px-4 py-3 gap-3">
					<div className="flex items-center justify-between">
						<h2 className="font-heading text-lg text-stone-900 dark:text-stone-50">
							{t("items.title")}
						</h2>
						{hasFilters && (
							<Button
								variant="ghost"
								size="xs"
								onClick={handleResetFilters}
								className="text-text-secondary"
							>
								<X className="mr-1 h-3 w-3" />
								{t("common.filter")}
							</Button>
						)}
					</div>

					{/* Relocated Search & Filter */}
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
							<Input
								ref={searchInputRef}
								placeholder={t("common.search")}
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setParams((prev) => ({
										...prev,
										pageNumber: 1,
									}));
								}}
								className="h-9 bg-stone-50 pl-9 text-sm placeholder:text-stone-400 focus:bg-white dark:bg-stone-900 dark:placeholder:text-stone-500 dark:focus:bg-card"
							/>
							{searchTerm && (
								<button
									type="button"
									onClick={() => {
										setSearchTerm("");
										setParams((prev) => ({
											...prev,
											pageNumber: 1,
										}));
										searchInputRef.current?.focus();
									}}
									className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
						<FilterDrawer
							itemType={params.itemType}
							category={params.category}
							status={params.status}
							onItemTypeChange={(v) => handleFilterChange("itemType", v)}
							onCategoryChange={(v) => handleFilterChange("category", v)}
							onStatusChange={(v) => handleFilterChange("status", v)}
							onReset={handleResetFilters}
						/>
					</div>

					{data?.pagination && (
						<p className="text-[12px] text-stone-400 dark:text-stone-500">
							{data.pagination.totalCount} {t("nav.items")}
						</p>
					)}
				</div>

				{/* Items List */}
				<div className="flex-1 overflow-y-auto px-4 py-3">
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 4 }).map((_, i) => (
								// eslint-disable-next-line react/no-array-index-key
								<ItemCardSkeleton key={`skeleton-${i}`} />
							))}
						</div>
					) : data?.items && data.items.length > 0 ? (
						<>
							<div className="space-y-3">
								{data.items.map((item) => (
									<ItemCard key={item.id} item={item} />
								))}
							</div>
							{isFetching && (
								<div className="mt-3 space-y-3">
									<ItemCardSkeleton />
									<ItemCardSkeleton />
								</div>
							)}
							<Pagination
								currentPage={data.pagination.pageNumber}
								totalPages={data.pagination.totalPages}
								onPageChange={handlePageChange}
								className="mt-4"
							/>
						</>
					) : (
						<EmptyState
							icon={PackageSearch}
							message={t("common.noResults")}
							subMessage={hasFilters ? t("common.filter") : undefined}
							actionLabel={hasFilters ? t("common.filter") : undefined}
							onAction={hasFilters ? handleResetFilters : undefined}
						/>
					)}
				</div>
			</div>

			{/* ===== FAB (Mobile only, authenticated) ===== */}
			{isAuthenticated && (
				<Link
					to="/items/new"
					className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-warm-2 transition-transform hover:scale-105 active:scale-95 md:hidden"
				>
					<Plus className="h-6 w-6" />
				</Link>
			)}
		</div>
	);
}
