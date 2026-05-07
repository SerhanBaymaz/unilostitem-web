import {
	AlertCircle,
	ArrowLeft,
	Clock,
	History,
	MessageSquare,
	PackageSearch,
	ShieldCheck,
	User,
	XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCancelClaim, useClaim, useExtendClaimDeadline } from "@/features/claims/hooks";
import type { Claim } from "@/features/claims/types";
import {
	ClaimStatusBadge,
	ItemDetailSkeleton,
	ItemStatusBadge,
	Timeline,
	type TimelineEntry,
} from "@/shared/components";

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function deriveTimeline(claim: Claim): TimelineEntry[] {
	const entries: TimelineEntry[] = [
		{
			date: claim.createdAt,
			actor: claim.claimantName,
			description: claim.description,
			status: "Pending",
		},
	];

	if (claim.status === "Cancelled") {
		entries.push({
			date: claim.updatedAt || claim.createdAt,
			actor: claim.claimantName,
			description: "claims.claimCancelled",
			status: "Cancelled",
		});
	}

	if (claim.respondedAt) {
		const isApproved = claim.status.startsWith("Approved");
		entries.push({
			date: claim.respondedAt,
			actor: claim.ownerName || "İlan Sahibi",
			description:
				claim.responseDescription || (isApproved ? "claims.ownerApproved" : "claims.ownerRejected"),
			status: claim.status,
		});
	}

	if (claim.adminReviewedAt) {
		const isApproved = claim.status === "ApprovedByAdmin";
		entries.push({
			date: claim.adminReviewedAt,
			actor: "Yönetici",
			description:
				claim.adminNote || (isApproved ? "claims.adminReviewed" : "claims.adminRejected"),
			status: claim.status,
		});
	}

	return entries;
}

export default function ClaimDetailPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuthStore();

	const { data: claim, isLoading, error } = useClaim(id ?? "");
	const cancelMutation = useCancelClaim();
	const extendMutation = useExtendClaimDeadline(id ?? "");

	const timelineEntries = useMemo(() => (claim ? deriveTimeline(claim) : []), [claim]);

	const isClaimant = user && claim && user.id === claim.claimantId;
	const canCancel = isClaimant && claim?.status === "Pending";
	const canExtend = isClaimant && claim?.status === "Pending" && (claim.extensionCount ?? 0) < 2;

	if (isLoading) return <ItemDetailSkeleton />;

	if (error || !claim) {
		return (
			<div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
				<AlertCircle className="h-16 w-16 text-stone-300" />
				<p className="text-stone-500">{t("claims.claimNotFound")}</p>
				<Button variant="outline" onClick={() => navigate(-1)}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t("common.back")}
				</Button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
			{/* Header Navigation */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(-1)}
					className="-ml-2 w-fit text-stone-500 hover:text-stone-900"
				>
					<ArrowLeft className="mr-1.5 h-4 w-4" />
					{t("common.back")}
				</Button>
				<div className="flex items-center gap-3">
					<span className="text-[12px] font-bold uppercase tracking-widest text-stone-400">
						TALEP DURUMU
					</span>
					<ClaimStatusBadge status={claim.status} />
					{claim.itemStatus && <ItemStatusBadge status={claim.itemStatus} />}
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-12">
				{/* Left Column: Claim Details */}
				<div className="space-y-6 lg:col-span-7">
					{/* Main Claim Card */}
					<div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-warm-1 sm:p-8">
						<div className="mb-6 flex items-center gap-4 border-b border-stone-100 pb-6">
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
								<MessageSquare className="h-6 w-6" />
							</div>
							<div>
								<h1 className="font-heading text-2xl font-bold text-stone-900">Talep Detayı</h1>
								<p className="text-sm text-stone-400">
									#{claim.id.slice(0, 8).toUpperCase()} • {formatDate(claim.createdAt)}
								</p>
							</div>
						</div>

						<div className="space-y-8">
							{/* Claimant's Message */}
							<div className="space-y-3">
								<Label className="text-xs font-bold uppercase tracking-widest text-stone-400">
									MESAJINIZ
								</Label>
								<div className="rounded-2xl bg-stone-50 p-5 border border-stone-100/50">
									<p className="text-[15px] leading-relaxed text-stone-700 italic">
										&ldquo;{claim.description}&rdquo;
									</p>
								</div>
							</div>

							{/* Related Item Link */}
							<div className="space-y-3">
								<Label className="text-xs font-bold uppercase tracking-widest text-stone-400">
									İLGİLİ İLAN
								</Label>
								<Link
									to={`/items/${claim.lostItemId}`}
									className="group flex items-center gap-4 rounded-2xl border border-stone-100 p-4 transition-all hover:bg-stone-50"
								>
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
										<PackageSearch className="h-6 w-6" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-[15px] font-bold text-stone-900 group-hover:text-amber-600">
											{claim.itemTitle}
										</p>
										<p className="text-xs text-stone-400">
											İlan detaylarını görüntülemek için tıklayın
										</p>
									</div>
									{claim.itemStatus && <ItemStatusBadge status={claim.itemStatus} />}
								</Link>
							</div>

							{/* Response Section (if exists) */}
							{(claim.responseDescription || claim.adminNote) && (
								<div className="space-y-4 pt-4 border-t border-stone-100">
									{claim.responseDescription && (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<User className="h-3.5 w-3.5 text-stone-400" />
												<Label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
													İLAN SAHİBİ YANITI
												</Label>
											</div>
											<p className="text-[14px] text-stone-600 leading-relaxed pl-5 border-l-2 border-amber-200">
												{claim.responseDescription}
											</p>
										</div>
									)}
									{claim.adminNote && (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
												<Label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
													YÖNETİCİ NOTU
												</Label>
											</div>
											<p className="text-[14px] text-stone-600 leading-relaxed pl-5 border-l-2 border-blue-200">
												{claim.adminNote}
											</p>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					{isClaimant && (canCancel || canExtend) && (
						<div className="flex flex-wrap gap-3">
							{canExtend && (
								<Button
									variant="outline"
									className="h-12 flex-1 rounded-xl font-semibold border-stone-200 hover:bg-stone-50"
									onClick={() => extendMutation.mutate()}
									disabled={extendMutation.isPending}
								>
									<Clock className="mr-2 h-4 w-4" />
									Süreyi Uzat ({claim.extensionCount ?? 0}/2)
								</Button>
							)}
							{canCancel && (
								<Button
									variant="destructive"
									className="h-12 flex-1 rounded-xl font-semibold shadow-lg shadow-red-500/10"
									onClick={() => {
										if (window.confirm(t("claims.cancelConfirm"))) {
											cancelMutation.mutate(claim.id, {
												onSuccess: () => navigate("/my-claims"),
											});
										}
									}}
									disabled={cancelMutation.isPending}
								>
									<XCircle className="mr-2 h-4 w-4" />
									Talebi İptal Et
								</Button>
							)}
						</div>
					)}
				</div>

				{/* Right Column: Meta Info & Timeline */}
				<div className="space-y-6 lg:col-span-5">
					{/* Status Info Card */}
					<div className="rounded-2xl border border-stone-200 bg-white shadow-warm-1 overflow-hidden">
						<div className="border-b border-stone-100 px-6 py-4">
							<h2 className="font-heading text-lg text-stone-900 flex items-center gap-2">
								<History className="h-5 w-5 text-stone-400" />
								{t("claims.timeline")}
							</h2>
						</div>
						<div className="p-6">
							<Timeline entries={timelineEntries} />
						</div>
						{claim.expiresAt && (
							<div className="bg-stone-50/50 p-6 border-t border-stone-100 space-y-4">
								<div className="flex justify-between items-center text-sm">
									<span className="text-stone-400">Son Geçerlilik</span>
									<span className="font-semibold text-stone-700">
										{new Date(claim.expiresAt).toLocaleDateString("tr-TR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
								</div>
								<div className="flex justify-between items-center text-sm">
									<span className="text-stone-400">Uzatma Hakkı</span>
									<span className="font-semibold text-stone-700">
										{claim.extensionCount ?? 0} / 2
									</span>
								</div>
							</div>
						)}
					</div>

					{/* Help Card */}
					<div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-6">
						<div className="flex gap-3">
							<AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
							<div className="space-y-1">
								<h4 className="text-sm font-bold text-amber-900">Bilgilendirme</h4>
								<p className="text-[13px] text-amber-700 leading-relaxed">
									Talebiniz ilan sahibi tarafından incelendikten sonra sistem üzerinden size
									bildirim gönderilecektir. Bu süreçte ilan sahibi sizinle iletişime geçebilir.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
