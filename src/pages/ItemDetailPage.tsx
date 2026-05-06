import {
	ArrowLeft,
	Calendar,
	MapPin,
	MessageSquare,
	PackageSearch,
	Pencil,
	Trash2,
	User,
} from "lucide-react";
import { useState } from "react";
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
import { useAuthStore } from "@/features/auth/store/authStore";
import { useDeleteItem, useItem } from "@/features/items/hooks";
import type { MapMarkerData } from "@/shared/components";
import { AppMap, ItemDetailSkeleton, ItemTypeBadge } from "@/shared/components";

export default function ItemDetailPage() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const { data: item, isLoading, error } = useItem(id ?? "");
	const deleteMutation = useDeleteItem();

	const isOwner = user && item && user.id === item.ownerId;

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
		deleteMutation.mutate(id ?? "");
	};

	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});

	if (isLoading) return <ItemDetailSkeleton />;

	if (error || !item) {
		return (
			<div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
				<PackageSearch className="h-16 w-16 text-stone-300" />
				<p className="text-stone-500">{t("common.noResults")}</p>
				<Button variant="outline" render={<Link to="/" />}>
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
					</div>

					{/* Actions */}
					<div className="mt-auto flex flex-col gap-2">
						{isOwner ? (
							<div className="flex gap-2">
								<Button
									variant="outline"
									className="flex-1"
									render={<Link to={`/items/${item.id}/edit`} />}
								>
									<Pencil className="mr-2 h-4 w-4" />
									{t("common.edit")}
								</Button>
								<Button
									variant="destructive"
									className="flex-1"
									onClick={() => setShowDeleteDialog(true)}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									{t("common.delete")}
								</Button>
							</div>
						) : (
							<Button className="w-full" size="lg">
								{t("items.claimItem")}
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Map Preview */}
			<div className="mt-6">
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
		</div>
	);
}
