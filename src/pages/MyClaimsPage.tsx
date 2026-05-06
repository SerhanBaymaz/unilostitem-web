import { PackageSearch, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useMyClaims } from "@/features/claims/hooks";
import { ClaimStatusBadge, EmptyState, ListSkeleton } from "@/shared/components";

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export default function MyClaimsPage() {
	const { t } = useTranslation();
	const { data, isLoading } = useMyClaims({ pageNumber: 1, pageSize: 20 });

	return (
		<div className="mx-auto max-w-3xl p-4 md:p-6">
			<h1 className="mb-6 font-heading text-2xl text-stone-900 md:text-[28px]">
				{t("profile.myClaims")}
			</h1>

			{isLoading ? (
				<ListSkeleton count={4} />
			) : !data?.claims || data.claims.length === 0 ? (
				<EmptyState
					icon={PackageSearch}
					message={t("profile.noClaims")}
					subMessage={t("profile.noClaimsSub")}
				/>
			) : (
				<div className="space-y-3">
					{data.claims.map((claim) => (
						<Link
							key={claim.id}
							to={`/claims/${claim.id}`}
							className="group flex items-center gap-4 rounded-lg border border-stone-100 bg-card p-4 shadow-warm-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm-2"
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-stone-100">
								<User className="h-5 w-5 text-stone-400" />
							</div>

							<div className="flex min-w-0 flex-1 flex-col gap-1">
								<div className="flex items-center gap-2">
									<h3 className="truncate text-sm font-semibold text-stone-900">
										{claim.itemTitle}
									</h3>
									<ClaimStatusBadge status={claim.status} />
								</div>
								<p className="truncate text-[13px] text-stone-500">{claim.description}</p>
								<p className="text-[12px] text-stone-400">{formatDate(claim.createdAt)}</p>
							</div>

							<span className="shrink-0 text-xs text-amber-600 opacity-0 transition-opacity group-hover:opacity-100">
								{t("profile.viewDetail")}
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
