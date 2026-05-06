import {
	ArrowLeft,
	Calendar,
	CheckCircle2,
	Clock,
	MapPin,
	MessageSquare,
	PackageSearch,
	Pencil,
	Plus,
	Trash2,
	User,
	XCircle,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router";
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
import { ClaimForm } from "@/features/claims/components";
import { useAdminReviewClaim, useClaimsByItem, useCreateClaim } from "@/features/claims/hooks";
import { useDeleteItem, useItem } from "@/features/items/hooks";
import type { MapMarkerData } from "@/shared/components";
import {
	AppMap,
	ClaimStatusBadge,
	ItemDetailSkeleton,
	ItemTypeBadge,
	Timeline,
	type TimelineEntry,
} from "@/shared/components";

export default function ItemDetailPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuthStore();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showClaimDialog, setShowClaimDialog] = useState(false);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [selectedClaimId, setSelectedReviewClaimId] = useState<string | null>(null);
	const [isAdminApproved, setIsAdminApproved] = useState(false);
	const [adminNote, setAdminNote] = useState("");

	const { data: item, isLoading, error } = useItem(id ?? "");
	const { data: claimsData } = useClaimsByItem(id ?? "");
	const deleteMutation = useDeleteItem();
	const createClaimMutation = useCreateClaim();
	const reviewMutation = useAdminReviewClaim(selectedClaimId ?? "");

	const isOwner = user && item && user.id === item.ownerId;
	const isAdmin = user?.role === "Admin";

	const timelineEntries = useMemo<TimelineEntry[]>(() => {
		if (!item) return [];

		const entries: TimelineEntry[] = [
			{
				date: item.createdAt,
				actor: item.ownerName,
				description: t("items.createSuccess"),
				status: "Approved",
			},
		];

		if (claimsData?.claims) {
			for (const claim of claimsData.claims) {
				entries.push({
					date: claim.createdAt,
					actor: claim.claimantName,
					description: claim.description,
					status: claim.status,
				});
			}
		}

		return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}, [item, claimsData, t]);

	const mapMarker: MapMarkerData | null =
		item?.latitude && item.longitude
			? {
					id: item.id,
					latitude: item.latitude,
					longitude: item.longitude,
					title: item.title,
					itemType: item.itemType,
				}
			: null;

	const handleDelete = () => {
		deleteMutation.mutate(id ?? "", {
			onSuccess: () => {
				navigate(isAdmin ? "/admin/items" : "/");
			}
		});
	};

	const handleClaimSubmit = (data: { description: string }) => {
		if (!id) return;
		createClaimMutation.mutate(
			{
				lostItemId: id,
				description: data.description,
			},
			{
				onSuccess: () => {
					setShowClaimDialog(false);
				},
			},
		);
	};

	const handleAdminReview = (e: FormEvent) => {
		e.preventDefault();
		if (!selectedClaimId) return;
		reviewMutation.mutate(
			{
				isApproved: isAdminApproved,
				adminNote: adminNote || undefined,
			},
			{
				onSuccess: () => {
					setShowReviewDialog(false);
					setSelectedReviewClaimId(null);
					setAdminNote("");
				},
			}
		);
	};

	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	if (isLoading) return <ItemDetailSkeleton />;

	if (error || !item) {
		return (
			<div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
				<PackageSearch className="h-16 w-16 text-stone-300" />
				<p className="text-stone-500">{t("common.noResults")}</p>
				<Button variant="outline" onClick={() => navigate(-1)}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					{t("common.back")}
				</Button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-screen-xl p-4 md:p-6">
			{/* Back Button */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => navigate(-1)}
				className="mb-4 -ml-2 text-stone-500"
			>
				<ArrowLeft className="mr-1 h-4 w-4" />
				{t("common.back")}
			</Button>

			{/* Main Content Grid */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Image */}
				<div className="aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
					{item.imageUrl ? (
						<img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<PackageSearch className="h-20 w-20 text-stone-300" />
						</div>
					)}
				</div>

				{/* Info Panel */}
				<div className="flex flex-col">
					{/* Title + Badge */}
					<div className="mb-4 flex items-start justify-between gap-3">
						<h1 className="font-heading text-2xl text-stone-900 md:text-[28px]">{item.title}</h1>
						<ItemTypeBadge type={item.itemType} />
					</div>

					{/* Category Badge */}
					<span className="mb-4 inline-block w-fit rounded-sm bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
						{item.category}
					</span>

					{/* Description */}
					{item.description && (
						<p className="mb-6 text-[15px] leading-relaxed text-stone-600">{item.description}</p>
					)}

					{/* Meta Info */}
					<div className="mb-6 space-y-3 rounded-lg border border-stone-100 bg-stone-50/50 p-4">
						<div className="flex items-center gap-3 text-sm text-stone-600">
							<Calendar className="h-4 w-4 shrink-0 text-stone-400" />
							<span>
								{t("items.incidentDate")}: {formatDate(item.incidentDate)}
							</span>
						</div>
						{item.locationLabel && (
							<div className="flex items-center gap-3 text-sm text-stone-600">
								<MapPin className="h-4 w-4 shrink-0 text-stone-400" />
								<span>{item.locationLabel}</span>
							</div>
						)}
						<div className="flex items-center gap-3 text-sm text-stone-600">
							<User className="h-4 w-4 shrink-0 text-stone-400" />
							<span>
								{t("items.reportedBy")} {item.ownerName}
							</span>
						</div>
						{item.contactInfo && (
							<div className="flex items-center gap-3 text-sm text-stone-600">
								<MessageSquare className="h-4 w-4 shrink-0 text-stone-400" />
								<span>{item.contactInfo}</span>
							</div>
						)}
						{item.claimCount !== undefined && (
							<div className="flex items-center gap-3 text-sm text-stone-600">
								<Clock className="h-4 w-4 shrink-0 text-stone-400" />
								<span>
									{item.claimCount} {t("claims.title")}
								</span>
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="mt-auto flex flex-col gap-2">
						{isOwner || isAdmin ? (
							<div className="flex gap-2">
								{isOwner && (
									<Button
										variant="outline"
										className="flex-1"
										render={<Link to={`/items/${item.id}/edit`} />}
									>
										<Pencil className="mr-2 h-4 w-4" />
										{t("common.edit")}
									</Button>
								)}
								<Button
									variant="destructive"
									className="flex-1"
									onClick={() => setShowDeleteDialog(true)}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									{t("common.delete")}
								</Button>
							</div>
						) : !isAuthenticated ? (
							<Button size="lg" onClick={() => navigate("/login")}>
								{t("nav.login")} & {t("items.claimItem")}
							</Button>
						) : (
							<Button
								className="w-full"
								size="lg"
								onClick={() => setShowClaimDialog(true)}
								disabled={item.status !== "Active"}
							>
								{item.status === "Active"
									? t("items.claimItem")
									: t(`items.${item.status.toLowerCase()}`)}
							</Button>
						)}
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2 mt-8">
				{/* Map Preview */}
				<div>
					<h2 className="mb-3 font-heading text-lg text-stone-900">{t("items.locationInfo")}</h2>
					{mapMarker ? (
						<AppMap
							center={[mapMarker.latitude, mapMarker.longitude]}
							zoom={15}
							markers={[mapMarker]}
							className="h-64 w-full rounded-lg md:h-80"
						/>
					) : (
						<div className="flex h-48 items-center justify-center rounded-lg bg-stone-100 text-stone-400">
							<MapPin className="mr-2 h-5 w-5" />
							{t("items.noLocation")}
						</div>
					)}
				</div>

				{/* Timeline & Claims (Detailed for Admin) */}
				<div className="space-y-6">
					<div>
						<h2 className="mb-3 font-heading text-lg text-stone-900">{t("claims.timeline")}</h2>
						<div className="rounded-lg border border-stone-100 bg-stone-50/50 p-6">
							<Timeline entries={timelineEntries} />
						</div>
					</div>

					{isAdmin && claimsData?.claims && claimsData.claims.length > 0 && (
						<div>
							<h2 className="mb-3 font-heading text-lg text-stone-900">
								{t("admin.claims")}
							</h2>
							<div className="space-y-3">
								{claimsData.claims.map((claim) => (
									<div
										key={claim.id}
										className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-semibold text-stone-900">
													{claim.claimantName}
												</p>
												<p className="text-xs text-stone-400">
													{formatDate(claim.createdAt)}
												</p>
											</div>
											<ClaimStatusBadge status={claim.status} />
										</div>
										<p className="text-sm text-stone-600">{claim.description}</p>
										{claim.status === "Pending" && (
											<div className="flex gap-2 pt-2">
												<Button
													variant="outline"
													size="sm"
													className="flex-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
													onClick={() => {
														setSelectedReviewClaimId(claim.id);
														setIsAdminApproved(true);
														setShowReviewDialog(true);
													}}
												>
													<CheckCircle2 className="mr-1.5 h-4 w-4" />
													{t("claims.approve")}
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
													onClick={() => {
														setSelectedReviewClaimId(claim.id);
														setIsAdminApproved(false);
														setShowReviewDialog(true);
													}}
												>
													<XCircle className="mr-1.5 h-4 w-4" />
													{t("claims.reject")}
												</Button>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("items.deleteItem")}</DialogTitle>
						<DialogDescription>{t("items.deleteConfirm")}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose render={<Button variant="outline" />}>{t("common.cancel")}</DialogClose>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? t("common.loading") : t("common.delete")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Claim Dialog (For Users) */}
			<Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t("claims.createClaim")}</DialogTitle>
						<DialogDescription>{t("claims.descriptionPlaceholder")}</DialogDescription>
					</DialogHeader>
					<ClaimForm
						onSubmit={handleClaimSubmit}
						isPending={createClaimMutation.isPending}
					/>
				</DialogContent>
			</Dialog>

			{/* Admin Review Dialog */}
			<Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isAdminApproved ? t("claims.approve") : t("claims.reject")}</DialogTitle>
						<DialogDescription>{t("admin.reviewDescription")}</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleAdminReview}>
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
						<DialogFooter className="mt-4">
							<DialogClose render={<Button variant="outline" />}>{t("common.cancel")}</DialogClose>
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
