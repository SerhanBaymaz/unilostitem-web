import {
	CheckCircle2,
	ChevronDown,
	MessageSquare,
	PackageSearch,
	User,
	XCircle,
} from "lucide-react";
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
import { useClaimsByItem, useRespondToClaim } from "@/features/claims/hooks";
import type { Claim } from "@/features/claims/types";
import { useMyItems } from "@/features/items/hooks";
import type { Item } from "@/features/items/types";
import {
	ClaimStatusBadge,
	EmptyState,
	ItemCardSkeleton,
	ItemStatusBadge,
	ItemTypeBadge,
	ListSkeleton,
} from "@/shared/components";

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
						<ItemWithClaims key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	);
}

function ItemWithClaims({ item }: { item: Item }) {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const { data: claimsData, isLoading: claimsLoading } = useClaimsByItem(item.id);
	const claims = claimsData?.claims ?? [];
	const hasClaims = (item.claimCount ?? 0) > 0;

	return (
		<div className="overflow-hidden rounded-xl border border-stone-100 bg-card shadow-warm-1 transition-all duration-200 hover:shadow-warm-2">
			{/* Item Row - clickable */}
			<Link
				to={`/items/${item.id}`}
				className="group flex items-center gap-4 p-4 transition-colors hover:bg-stone-50/50"
			>
				{/* Image */}
				<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-50 border border-stone-100/50">
					{item.imageUrl ? (
						<img
							src={item.imageUrl}
							alt={item.title}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<PackageSearch className="h-8 w-8 text-stone-200" />
						</div>
					)}
				</div>

				{/* Content */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<h3 className="truncate text-[15px] font-bold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
							{item.title}
						</h3>
						<ItemStatusBadge status={item.status} />
						<ItemTypeBadge type={item.itemType} />
					</div>
					<div className="mt-1 flex items-center gap-3 text-[12px] text-stone-400">
						<User className="h-3 w-3" />
						<span>
							{item.claimCount || 0} {t("claims.title")}
						</span>
					</div>
				</div>

				{/* Chevron for accordion - only if has claims */}
				{hasClaims && <PackageSearch className="h-4 w-4 shrink-0 text-stone-300" />}
			</Link>

			{/* Claims Accordion */}
			{hasClaims && (
				<>
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="flex w-full items-center gap-2 border-t border-stone-100 bg-stone-50/50 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-700"
					>
						<MessageSquare className="h-3.5 w-3.5" />
						{t("claims.receivedClaims")} ({item.claimCount})
						<ChevronDown
							className={`ml-auto h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
						/>
					</button>

					{isOpen && (
						<div className="border-t border-stone-100 bg-white">
							{claimsLoading ? (
								<div className="p-4">
									<ListSkeleton count={1} />
								</div>
							) : (
								<div className="divide-y divide-stone-100">
									{claims.map((claim) => (
										<ClaimItemCard key={claim.id} claim={claim} />
									))}
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}

function ClaimItemCard({ claim }: { claim: Claim }) {
	const { t } = useTranslation();
	const [showRespondDialog, setShowRespondDialog] = useState(false);
	const [isApproved, setIsApproved] = useState(false);
	const [responseText, setResponseText] = useState("");
	const respondMutation = useRespondToClaim(claim.id);

	const handleRespond = (e: FormEvent) => {
		e.preventDefault();
		respondMutation.mutate(
			{
				isApproved,
				responseDescription: responseText || undefined,
			},
			{
				onSuccess: () => {
					setShowRespondDialog(false);
					setResponseText("");
				},
			},
		);
	};

	return (
		<>
			<div className="px-4 py-3">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-2 min-w-0">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100">
							<User className="h-3.5 w-3.5 text-stone-500" />
						</div>
						<div className="min-w-0">
							<span className="text-sm font-semibold text-stone-900">{claim.claimantName}</span>
							<span className="ml-2 text-[11px] text-stone-400">
								{new Date(claim.createdAt).toLocaleDateString("tr-TR", {
									day: "numeric",
									month: "short",
								})}
							</span>
						</div>
					</div>
					<ClaimStatusBadge status={claim.status} />
				</div>

				<p className="mt-2 ml-9 text-[13px] leading-relaxed text-stone-600">{claim.description}</p>

				{claim.status === "Pending" && (
					<div className="mt-3 ml-9 flex gap-2">
						<Button
							variant="outline"
							size="sm"
							className="h-7 flex-1 rounded-lg text-[12px] text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
							onClick={() => {
								setIsApproved(true);
								setShowRespondDialog(true);
							}}
						>
							<CheckCircle2 className="mr-1 h-3 w-3" />
							{t("claims.approve")}
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-7 flex-1 rounded-lg text-[12px] text-red-600 hover:bg-red-50 hover:text-red-700"
							onClick={() => {
								setIsApproved(false);
								setShowRespondDialog(true);
							}}
						>
							<XCircle className="mr-1 h-3 w-3" />
							{t("claims.reject")}
						</Button>
					</div>
				)}
			</div>

			<Dialog open={showRespondDialog} onOpenChange={setShowRespondDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isApproved ? t("claims.approve") : t("claims.reject")}</DialogTitle>
						<DialogDescription>{t("claims.responsePlaceholder")}</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleRespond} className="space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="respond-comment" className="text-stone-700">
								{t("claims.responseDescription")}
							</Label>
							<Textarea
								id="respond-comment"
								value={responseText}
								onChange={(e) => setResponseText(e.target.value)}
								placeholder={t("claims.responsePlaceholder")}
								rows={3}
							/>
						</div>
						<DialogFooter>
							<DialogClose render={<Button variant="outline" />}>{t("common.cancel")}</DialogClose>
							<Button
								type="submit"
								disabled={respondMutation.isPending}
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
