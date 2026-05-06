import { CheckCircle2, MessageSquare, PackageSearch, User, XCircle } from "lucide-react";
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
import { useMyItems } from "@/features/items/hooks";
import type { Item } from "@/features/items/types";
import { CategoryBadge, ClaimStatusBadge, EmptyState, ListSkeleton } from "@/shared/components";

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export default function ReceivedClaimsPage() {
	const { t } = useTranslation();
	const { data, isLoading } = useMyItems({ pageSize: 100 }); // Get more items to filter

	// Filter only items that have claims
	const itemsWithClaims = data?.items?.filter((item) => (item.claimCount ?? 0) > 0) ?? [];

	return (
		<div className="mx-auto max-w-4xl p-4 md:p-6 space-y-8">
			<div>
				<h1 className="font-heading text-2xl text-stone-900 md:text-[28px]">
					{t("claims.receivedClaims") || "Gelen Talepler"}
				</h1>
				<p className="mt-1 text-sm text-stone-400">
					İlanlarınıza gelen tüm kullanıcı taleplerini buradan yönetebilirsiniz.
				</p>
			</div>

			{isLoading ? (
				<ListSkeleton count={3} />
			) : itemsWithClaims.length === 0 ? (
				<EmptyState
					icon={MessageSquare}
					message={t("claims.noReceivedClaims") || "Henüz bir talep gelmedi"}
					subMessage="İlanlarınız için bir talep oluşturulduğunda burada görünecektir."
				/>
			) : (
				<div className="space-y-10">
					{itemsWithClaims.map((item) => (
						<ItemClaimsGroup key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	);
}

function ItemClaimsGroup({ item }: { item: Item }) {
	const { t } = useTranslation();
	const { data, isLoading } = useClaimsByItem(item.id);
	const claims = data?.claims ?? [];

	return (
		<div className="space-y-4">
			{/* Item Header */}
			<Link
				to={`/items/${item.id}`}
				className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50/50 p-4 transition-colors hover:bg-stone-50"
			>
				<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-200">
					{item.imageUrl ? (
						<img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<PackageSearch className="h-8 w-8 text-stone-400" />
						</div>
					)}
				</div>
				<div className="min-w-0 flex-1">
					<h2 className="truncate text-lg font-semibold text-stone-900 group-hover:text-amber-600">
						{item.title}
					</h2>
					<div className="mt-1 flex items-center gap-3 text-sm text-stone-500">
						<CategoryBadge category={item.category} />
						<span className="h-1 w-1 rounded-full bg-stone-300" />
						<span>{formatDate(item.createdAt)}</span>
					</div>
				</div>
				<div className="text-right">
					<p className="text-xl font-bold text-amber-600">{item.claimCount}</p>
					<p className="text-[11px] font-medium uppercase tracking-wider text-stone-400">
						{t("claims.title")}
					</p>
				</div>
			</Link>

			{/* Claims List for this item */}
			<div className="ml-4 space-y-3 border-l-2 border-stone-100 pl-6 md:ml-8">
				{isLoading ? (
					<ListSkeleton count={1} />
				) : (
					claims.map((claim) => <ClaimItemCard key={claim.id} claim={claim} />)
				)}
			</div>
		</div>
	);
}

function ClaimItemCard({ claim }: { claim: any }) {
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
		<div className="rounded-lg border border-stone-100 bg-card p-4 shadow-warm-1">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100">
						<User className="h-4 w-4 text-stone-500" />
					</div>
					<span className="text-sm font-semibold text-stone-900">{claim.claimantName}</span>
					<span className="text-[12px] text-stone-400">• {formatDate(claim.createdAt)}</span>
				</div>
				<ClaimStatusBadge status={claim.status} />
			</div>

			<p className="mt-3 text-sm leading-relaxed text-stone-600">{claim.description}</p>

			{claim.status === "Pending" && (
				<div className="mt-4 flex gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-8 flex-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
						onClick={() => {
							setIsApproved(true);
							setShowRespondDialog(true);
						}}
					>
						<CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
						{t("claims.approve")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-8 flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
						onClick={() => {
							setIsApproved(false);
							setShowRespondDialog(true);
						}}
					>
						<XCircle className="mr-1.5 h-3.5 w-3.5" />
						{t("claims.reject")}
					</Button>
				</div>
			)}

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
		</div>
	);
}
