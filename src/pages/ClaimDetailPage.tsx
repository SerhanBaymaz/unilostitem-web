import {
	ArrowLeft,
	CheckCircle2,
	MessageSquare,
	PackageSearch,
	XCircle,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
	useAdminReviewClaim,
	useCancelClaim,
	useClaim,
	useRespondToClaim,
} from "@/features/claims/hooks";
import type { Claim } from "@/features/claims/types";
import {
	ClaimStatusBadge,
	Timeline,
	type TimelineEntry,
} from "@/shared/components";

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
			date: claim.updatedAt,
			actor: claim.claimantName,
			description: "claims.claimCancelled",
			status: "Cancelled",
		});
	}

	if (claim.respondedAt) {
		const isApproved =
			claim.status === "Approved" ||
			claim.responseDescription?.toLowerCase().includes("approve");
		entries.push({
			date: claim.respondedAt,
			actor: claim.claimantName,
			description:
				claim.responseDescription ||
				(isApproved ? "claims.ownerApproved" : "claims.ownerRejected"),
			status: isApproved ? "Approved" : "Rejected",
		});
	}

	if (claim.adminReviewedAt) {
		entries.push({
			date: claim.adminReviewedAt,
			actor: "Admin",
			description: claim.adminNote || "claims.adminReviewed",
			status: claim.status,
		});
	}

	return entries;
}

export default function ClaimDetailPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { user } = useAuthStore();
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [showRespondDialog, setShowRespondDialog] = useState(false);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [responseText, setResponseText] = useState("");
	const [isAdminApproved, setIsAdminApproved] = useState(false);

	const { data: claim, isLoading, error } = useClaim(id ?? "");
	const cancelMutation = useCancelClaim();
	const respondMutation = useRespondToClaim(id ?? "");
	const reviewMutation = useAdminReviewClaim(id ?? "");

	if (isLoading) {
		return (
			<div className="mx-auto max-w-2xl animate-pulse p-6 space-y-4">
				<div className="h-6 w-48 rounded bg-stone-200" />
				<div className="h-40 rounded-lg bg-stone-200" />
			</div>
		);
	}

	if (error || !claim) {
		return (
			<div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
				<PackageSearch className="h-16 w-16 text-stone-300" />
				<p className="text-stone-500">{t("claims.claimNotFound")}</p>
				<Button variant="outline" render={<Link to="/" />}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t("common.back")}
				</Button>
			</div>
		);
	}

	const timelineEntries = deriveTimeline(claim);
	const isClaimant = user?.id === claim.claimantId;
	const isOwner = user?.id === claim.ownerId;
	const isAdmin = user?.role === "Admin";

	const canCancel = isClaimant && claim.status === "Pending";
	const canRespond = isOwner && claim.status === "Pending";
	const canReview = isAdmin && claim.status === "Pending";

	const handleCancel = () => {
		cancelMutation.mutate(id ?? "");
		setShowCancelDialog(false);
	};

	const handleRespond = (e: FormEvent) => {
		e.preventDefault();
		respondMutation.mutate({
			isApproved: responseText.length > 0,
			responseDescription: responseText || undefined,
		});
		setShowRespondDialog(false);
		setResponseText("");
	};

	const handleAdminReview = (e: FormEvent) => {
		e.preventDefault();
		reviewMutation.mutate({
			isApproved: isAdminApproved,
			adminNote: responseText || undefined,
		});
		setShowReviewDialog(false);
		setResponseText("");
	};

	return (
		<div className="mx-auto max-w-2xl p-4 md:p-6">
			{/* Back Button */}
			<Button
				variant="ghost"
				size="sm"
				render={<Link to={-1 as unknown as string} />}
				onClick={(e) => {
					e.preventDefault();
					window.history.back();
				}}
				className="mb-4 -ml-2 text-stone-500"
			>
				<ArrowLeft className="mr-1 h-4 w-4" />
				{t("common.back")}
			</Button>

			{/* Header */}
			<div className="mb-6 flex items-start justify-between gap-3">
				<div>
					<h1 className="font-heading text-2xl text-stone-900 md:text-[28px]">
						{t("claims.claimTitle")}
					</h1>
					<ClaimStatusBadge status={claim.status} />
				</div>
			</div>

			{/* Item Preview */}
			<div className="mb-6 rounded-lg border border-stone-100 bg-stone-50/50 p-4">
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
					{t("claims.itemInfo")}
				</p>
				<Link
					to={`/items/${claim.lostItemId}`}
					className="group flex items-center gap-3"
				>
					<div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-stone-200">
						{claim.itemImageUrl ? (
							<img
								src={claim.itemImageUrl}
								alt={claim.itemTitle}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center">
								<PackageSearch className="h-6 w-6 text-stone-400" />
							</div>
						)}
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-semibold text-stone-900 group-hover:text-amber-600">
							{claim.itemTitle}
						</p>
					</div>
					<span className="shrink-0 text-xs text-amber-600">
						{t("claims.goToItem")}
					</span>
				</Link>
			</div>

			{/* Claim Info */}
			<div className="mb-6 rounded-lg border border-stone-100 bg-stone-50/50 p-4">
				<div className="grid gap-3">
					<div>
						<p className="text-xs font-medium text-stone-400">
							{t("claims.claimant")}
						</p>
						<p className="text-sm font-semibold text-stone-900">
							{claim.claimantName}
						</p>
					</div>
					<div>
						<p className="text-xs font-medium text-stone-400">
							{t("claims.owner")}
						</p>
						<p className="text-sm font-semibold text-stone-900">
							{claim.ownerName}
						</p>
					</div>
					<div>
						<p className="text-xs font-medium text-stone-400">
							{t("items.description")}
						</p>
						<p className="text-sm leading-relaxed text-stone-600">
							{claim.description}
						</p>
					</div>
				</div>
			</div>

			<Separator className="my-6" />

			{/* Timeline */}
			<div className="mb-6">
				<h2 className="mb-4 font-heading text-lg text-stone-900">
					{t("claims.timeline")}
				</h2>
				<Timeline entries={timelineEntries} currentStatus={claim.status} />
			</div>

			{/* Actions */}
			{(canCancel || canRespond || canReview) && (
				<>
					<Separator className="my-6" />
					<div className="flex flex-wrap gap-2">
						{canCancel && (
							<Button
								variant="outline"
								className="text-red-600 hover:bg-red-50 hover:text-red-700"
								onClick={() => setShowCancelDialog(true)}
							>
								<XCircle className="mr-2 h-4 w-4" />
								{t("claims.cancel")}
							</Button>
						)}
						{canRespond && (
							<>
								<Button
									variant="outline"
									className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
									onClick={() => {
										setIsAdminApproved(true);
										setResponseText("");
										setShowRespondDialog(true);
									}}
								>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									{t("claims.approve")}
								</Button>
								<Button
									variant="outline"
									className="text-red-600 hover:bg-red-50 hover:text-red-700"
									onClick={() => {
										setIsAdminApproved(false);
										setResponseText("");
										setShowRespondDialog(true);
									}}
								>
									<XCircle className="mr-2 h-4 w-4" />
									{t("claims.reject")}
								</Button>
							</>
						)}
						{canReview && (
							<Button
								onClick={() => {
									setIsAdminApproved(true);
									setResponseText("");
									setShowReviewDialog(true);
								}}
							>
								<MessageSquare className="mr-2 h-4 w-4" />
								{t("admin.reviewNote")}
							</Button>
						)}
					</div>
				</>
			)}

			{/* Cancel Dialog */}
			<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("claims.cancel")}</DialogTitle>
						<DialogDescription>{t("claims.cancelConfirm")}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose render={<Button variant="outline" />}>
							{t("common.cancel")}
						</DialogClose>
						<Button
							variant="destructive"
							onClick={handleCancel}
							disabled={cancelMutation.isPending}
						>
							{t("claims.cancel")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Respond Dialog */}
			<Dialog open={showRespondDialog} onOpenChange={setShowRespondDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isAdminApproved ? t("claims.approve") : t("claims.reject")}
						</DialogTitle>
						<DialogDescription>
							{t("claims.responsePlaceholder")}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleRespond}>
						<div className="space-y-1.5">
							<Label htmlFor="respond-desc" className="text-stone-700">
								{t("claims.responseDescription")}
							</Label>
							<Textarea
								id="respond-desc"
								value={responseText}
								onChange={(e) => setResponseText(e.target.value)}
								placeholder={t("claims.responsePlaceholder")}
								rows={3}
							/>
						</div>
						<DialogFooter>
							<DialogClose render={<Button variant="outline" />}>
								{t("common.cancel")}
							</DialogClose>
							<Button
								type="submit"
								disabled={respondMutation.isPending}
								variant={isAdminApproved ? "default" : "destructive"}
							>
								{isAdminApproved ? t("claims.approve") : t("claims.reject")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Admin Review Dialog */}
			<Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("admin.reviewNote")}</DialogTitle>
						<DialogDescription>
							{t("claims.responsePlaceholder")}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleAdminReview}>
						<div className="space-y-4">
							<div className="flex gap-2">
								<Button
									type="button"
									variant={isAdminApproved ? "default" : "outline"}
									size="sm"
									onClick={() => setIsAdminApproved(true)}
								>
									<CheckCircle2 className="mr-1 h-4 w-4" />
									{t("claims.approve")}
								</Button>
								<Button
									type="button"
									variant={!isAdminApproved ? "destructive" : "outline"}
									size="sm"
									onClick={() => setIsAdminApproved(false)}
								>
									<XCircle className="mr-1 h-4 w-4" />
									{t("claims.reject")}
								</Button>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="admin-note" className="text-stone-700">
									{t("claims.adminNote")}
								</Label>
								<Textarea
									id="admin-note"
									value={responseText}
									onChange={(e) => setResponseText(e.target.value)}
									placeholder={t("claims.adminNotePlaceholder")}
									rows={3}
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose render={<Button variant="outline" />}>
								{t("common.cancel")}
							</DialogClose>
							<Button
								type="submit"
								disabled={reviewMutation.isPending}
								variant={isAdminApproved ? "default" : "destructive"}
							>
								{isAdminApproved ? t("claims.approve") : t("claims.reject")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
