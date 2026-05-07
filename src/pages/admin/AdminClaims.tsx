import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminReviewClaim, usePendingClaims } from "@/features/claims/hooks";
import { ClaimStatusBadge, ItemStatusBadge, ListSkeleton } from "@/shared/components";

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export default function AdminClaims() {
	const { t } = useTranslation();
	const { data, isLoading } = usePendingClaims({
		pageNumber: 1,
		pageSize: 50,
		sortBy: "createdAt",
		sortDescending: true,
	});

	const claims = data?.claims ?? [];

	return (
		<div className="mx-auto max-w-5xl space-y-6">
			<div>
				<h1 className="font-heading text-2xl text-stone-900 md:text-[28px]">{t("admin.claims")}</h1>
				<p className="mt-1 text-sm text-stone-400">{t("admin.claimsSubtitle")}</p>
			</div>

			{isLoading ? (
				<ListSkeleton count={6} />
			) : claims.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<Clock className="mb-4 h-12 w-12 text-stone-300" strokeWidth={1.5} />
					<p className="text-base text-stone-500">{t("admin.noPendingClaims")}</p>
				</div>
			) : (
				<div className="space-y-3">
					{claims.map((claim) => (
						<ClaimRow key={claim.id} claim={claim} />
					))}
				</div>
			)}
		</div>
	);
}

function ClaimRow({
	claim,
}: {
	claim: ReturnType<typeof usePendingClaims>["data"] extends { claims: (infer T)[] } | undefined
		? T
		: never;
}) {
	const { t } = useTranslation();
	const [showDialog, setShowDialog] = useState(false);
	const [isApproved, setIsApproved] = useState(false);
	const [adminNote, setAdminNote] = useState("");
	const reviewMutation = useAdminReviewClaim(claim.id);

	const openDialog = (approve: boolean) => {
		setIsApproved(approve);
		setAdminNote("");
		setShowDialog(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		reviewMutation.mutate({
			isApproved,
			adminNote: adminNote || undefined,
		});
		setShowDialog(false);
	};

	return (
		<>
			<div className="flex flex-col gap-3 rounded-lg border border-stone-100 bg-card p-4 shadow-warm-1 sm:flex-row sm:items-center sm:gap-4">
				<div className="flex-1 min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<Link
							to={`/items/${claim.lostItemId}`}
							className="truncate text-sm font-semibold text-stone-900 hover:text-amber-600"
						>
							{claim.itemTitle}
						</Link>
						{claim.itemStatus && <ItemStatusBadge status={claim.itemStatus} />}
						<ClaimStatusBadge status={claim.status} />
					</div>
					<div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-stone-400">
						<span>{claim.claimantName}</span>
						<span>{formatDate(claim.createdAt)}</span>
						{claim.description && (
							<span className="hidden truncate sm:inline">{claim.description}</span>
						)}
					</div>
				</div>

				<div className="flex shrink-0 gap-2">
					<Button
						variant="outline"
						size="sm"
						className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
						onClick={() => openDialog(true)}
						disabled={reviewMutation.isPending}
					>
						<CheckCircle2 className="mr-1.5 h-4 w-4" />
						{t("claims.approve")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="text-red-600 hover:bg-red-50 hover:text-red-700"
						onClick={() => openDialog(false)}
						disabled={reviewMutation.isPending}
					>
						<XCircle className="mr-1.5 h-4 w-4" />
						{t("claims.reject")}
					</Button>
				</div>
			</div>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isApproved ? t("claims.approve") : t("claims.reject")}</DialogTitle>
						<DialogDescription>{t("admin.reviewDescription")}</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="space-y-1.5">
							<Label htmlFor="admin-note" className="text-stone-700">
								{t("claims.adminNote")}
							</Label>
							<Textarea
								id="admin-note"
								value={adminNote}
								onChange={(e) => setAdminNote(e.target.value)}
								placeholder={t("claims.adminNotePlaceholder")}
								rows={3}
							/>
						</div>
						<DialogFooter>
							<DialogClose render={<Button variant="outline" />}>{t("common.cancel")}</DialogClose>
							<Button
								type="submit"
								disabled={reviewMutation.isPending}
								variant={isApproved ? "default" : "destructive"}
							>
								{isApproved ? t("claims.approve") : t("claims.reject")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
