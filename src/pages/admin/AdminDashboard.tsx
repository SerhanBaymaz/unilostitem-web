import { CheckCircle2, Clock, Package, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { usePendingClaims } from "@/features/claims/hooks";
import type { Claim } from "@/features/claims/types";
import { useItems } from "@/features/items/hooks";
import type { Item } from "@/features/items/types";
import { ClaimStatusBadge } from "@/shared/components";

function StatCard({
	icon: Icon,
	label,
	value,
	subValue,
	color,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string | number;
	subValue?: string;
	color: string;
}) {
	return (
		<div className="rounded-lg border border-stone-100 bg-card p-5 shadow-warm-1">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-[13px] font-medium text-stone-400">{label}</p>
					<p className="mt-1 text-2xl font-semibold text-stone-900">{value}</p>
					{subValue && (
						<p className="mt-1 text-[12px] text-stone-400">{subValue}</p>
					)}
				</div>
				<div
					className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
				>
					<Icon className="h-5 w-5" />
				</div>
			</div>
		</div>
	);
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export default function AdminDashboard() {
	const { t } = useTranslation();

	const { data: itemsData } = useItems({
		pageNumber: 1,
		pageSize: 1,
	});
	const { data: pendingData } = usePendingClaims({
		pageNumber: 1,
		pageSize: 1,
	});
	const { data: recentItems } = useItems({
		pageNumber: 1,
		pageSize: 5,
		sortBy: "createdAt",
		sortDescending: true,
	});
	const { data: recentClaims } = usePendingClaims({
		pageNumber: 1,
		pageSize: 5,
		sortBy: "createdAt",
		sortDescending: true,
	});

	const totalItems = itemsData?.pagination.totalCount ?? 0;
	const pendingClaims = pendingData?.pagination.totalCount ?? 0;
	const recentItemsList = recentItems?.items ?? [];
	const recentClaimsList = recentClaims?.claims ?? [];

	return (
		<div className="mx-auto max-w-5xl space-y-6">
			<div>
				<h1 className="font-heading text-2xl text-stone-900 md:text-[28px]">
					{t("admin.dashboard")}
				</h1>
				<p className="mt-1 text-sm text-stone-400">
					{t("admin.dashboardSubtitle")}
				</p>
			</div>

			{/* Stat Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					icon={Package}
					label={t("admin.totalItems")}
					value={totalItems}
					color="bg-amber-50 text-amber-600"
				/>
				<StatCard
					icon={Clock}
					label={t("admin.pendingClaims")}
					value={pendingClaims}
					subValue={t("admin.awaitingReview")}
					color="bg-amber-50 text-amber-600"
				/>
				<StatCard
					icon={CheckCircle2}
					label={t("admin.resolvedItems")}
					value="—"
					color="bg-emerald-50 text-emerald-600"
				/>
				<StatCard
					icon={ShieldCheck}
					label={t("admin.thisMonth")}
					value="—"
					color="bg-blue-50 text-blue-600"
				/>
			</div>

			{/* Recent Activity */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Items */}
				<div className="rounded-lg border border-stone-100 bg-card p-4 shadow-warm-1">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="font-heading text-base font-medium text-stone-900">
							{t("admin.recentItems")}
						</h2>
						<Link
							to="/admin/items"
							className="text-[13px] font-medium text-amber-600 hover:text-amber-700"
						>
							{t("admin.viewAll")}
						</Link>
					</div>

					{recentItemsList.length > 0 ? (
						<div className="space-y-2">
							{recentItemsList.map((item: Item) => (
								<Link
									key={item.id}
									to={`/items/${item.id}`}
									className="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-stone-50"
								>
									<div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-stone-100">
										{item.imageUrl ? (
											<img
												src={item.imageUrl}
												alt={item.title}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center">
												<Package className="h-4 w-4 text-stone-300" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="truncate text-sm font-medium text-stone-700 group-hover:text-amber-600">
											{item.title}
										</p>
										<p className="text-[12px] text-stone-400">
											{formatDate(item.createdAt)}
										</p>
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className="py-4 text-center text-sm text-stone-400">
							{t("admin.noData")}
						</p>
					)}
				</div>

				{/* Pending Claims */}
				<div className="rounded-lg border border-stone-100 bg-card p-4 shadow-warm-1">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="font-heading text-base font-medium text-stone-900">
							{t("admin.pendingClaims")}
						</h2>
						<Link
							to="/admin/claims"
							className="text-[13px] font-medium text-amber-600 hover:text-amber-700"
						>
							{t("admin.viewAll")}
						</Link>
					</div>

					{recentClaimsList.length > 0 ? (
						<div className="space-y-2">
							{recentClaimsList.map((claim: Claim) => (
								<Link
									key={claim.id}
									to={`/claims/${claim.id}`}
									className="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-stone-50"
								>
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-100">
										<Clock className="h-4 w-4 text-amber-500" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="truncate text-sm font-medium text-stone-700 group-hover:text-amber-600">
											{claim.itemTitle}
										</p>
										<div className="flex items-center gap-2">
											<p className="text-[12px] text-stone-400">
												{claim.claimantName}
											</p>
											<ClaimStatusBadge status={claim.status} />
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className="py-4 text-center text-sm text-stone-400">
							{t("admin.noPendingClaims")}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
