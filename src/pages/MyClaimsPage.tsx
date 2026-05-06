import { ArrowRight, Calendar, Clock, PackageSearch } from "lucide-react";
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
		<div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">
			<div className="mb-8">
				<h1 className="font-heading text-2xl text-stone-900 md:text-[32px]">
					{t("profile.myClaims")}
				</h1>
				<p className="mt-1.5 text-sm text-stone-500">
					Oluşturduğunuz tüm talepleri ve durumlarını buradan takip edebilirsiniz.
				</p>
			</div>

			{isLoading ? (
				<ListSkeleton count={4} />
			) : !data?.claims || data.claims.length === 0 ? (
				<EmptyState
					icon={MessageSearch}
					message={t("profile.noClaims")}
					subMessage={t("profile.noClaimsSub")}
				/>
			) : (
				<div className="grid gap-4">
					{data.claims.map((claim) => (
						<Link
							key={claim.id}
							to={`/claims/${claim.id}`}
							className="group relative flex flex-col gap-4 rounded-2xl border border-stone-100 bg-card p-5 shadow-warm-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm-2 active:scale-[0.99]"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-center gap-3 min-w-0">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
										<PackageSearch className="h-5 w-5" />
									</div>
									<div className="min-w-0">
										<h3 className="truncate text-[16px] font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
											{claim.itemTitle}
										</h3>
										<div className="mt-0.5 flex items-center gap-2 text-[12px] text-stone-400">
											<Calendar className="h-3 w-3" />
											<span>{formatDate(claim.createdAt)}</span>
										</div>
									</div>
								</div>
								<ClaimStatusBadge status={claim.status} />
							</div>

							<div className="flex flex-col gap-3 rounded-xl bg-stone-50/50 p-3 border border-stone-100/50">
								<p className="line-clamp-2 text-[13.5px] leading-relaxed text-stone-600 italic">
									"{claim.description}"
								</p>
							</div>

							<div className="flex items-center justify-between mt-1">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-400">
										<Clock className="h-3 w-3" />
										<span>Sonlanma: {new Date(claim.expiresAt).toLocaleDateString("tr-TR")}</span>
									</div>
								</div>
								<div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
									{t("profile.viewDetail")}
									<ArrowRight className="h-3 w-3" />
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
