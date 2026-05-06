import { Calendar, Mail, PackageSearch, Phone, Shield, User, UserCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile, useUpdateProfile } from "@/features/auth/hooks";
import { useMyClaims } from "@/features/claims/hooks";
import { ItemCard } from "@/features/items/components";
import { useMyItems } from "@/features/items/hooks";
import { ClaimStatusBadge, EmptyState, ItemCardSkeleton, ListSkeleton } from "@/shared/components";

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export default function ProfilePage() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("info");

	return (
		<div className="mx-auto max-w-3xl p-4 md:p-6">
			<h1 className="mb-6 font-heading text-2xl text-stone-900 md:text-[28px]">
				{t("profile.title")}
			</h1>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList variant="line">
					<TabsTrigger value="info">{t("profile.info")}</TabsTrigger>
					<TabsTrigger value="items">{t("profile.myItems")}</TabsTrigger>
					<TabsTrigger value="claims">{t("profile.myClaims")}</TabsTrigger>
				</TabsList>

				<TabsContent value="info" className="mt-6">
					<ProfileInfoTab />
				</TabsContent>

				<TabsContent value="items" className="mt-6">
					<MyItemsTab />
				</TabsContent>

				<TabsContent value="claims" className="mt-6">
					<MyClaimsTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function ProfileInfoTab() {
	const { t } = useTranslation();
	const { data: profile, isLoading } = useProfile();
	const updateMutation = useUpdateProfile();
	const [isEditing, setIsEditing] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");

	if (isLoading) {
		return <ProfileInfoSkeleton />;
	}

	if (!profile) {
		return <EmptyState icon={UserCircle} message={t("common.error")} className="py-12" />;
	}

	const startEdit = () => {
		setFirstName(profile.firstName);
		setLastName(profile.lastName);
		setPhone(profile.phoneNumber ?? "");
		setIsEditing(true);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		updateMutation.mutate(
			{
				firstName,
				lastName,
				phoneNumber: phone || undefined,
			},
			{
				onSuccess: () => setIsEditing(false),
			},
		);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase();

	return (
		<div className="space-y-6">
			{/* Profile Card */}
			<div className="rounded-lg border border-stone-100 bg-stone-50/50 p-6">
				<div className="flex items-start gap-4">
					<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl font-semibold text-amber-700">
						{initials}
					</div>
					<div className="flex-1 space-y-3">
						<div>
							<h2 className="text-lg font-semibold text-stone-900">
								{profile.firstName} {profile.lastName}
							</h2>
							<span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
								<Shield className="h-3 w-3" />
								{profile.role}
							</span>
						</div>

						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2 text-stone-600">
								<Mail className="h-4 w-4 text-stone-400" />
								{profile.email}
							</div>
							{profile.phoneNumber && (
								<div className="flex items-center gap-2 text-stone-600">
									<Phone className="h-4 w-4 text-stone-400" />
									{profile.phoneNumber}
								</div>
							)}
							<div className="flex items-center gap-2 text-stone-400">
								<Calendar className="h-4 w-4" />
								{t("profile.memberSince")}: {formatDate(profile.createdAt)}
							</div>
						</div>

						{!isEditing && (
							<Button variant="outline" size="sm" onClick={startEdit} className="mt-2">
								{t("profile.edit")}
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Edit Form */}
			{isEditing && (
				<>
					<Separator />
					<form onSubmit={handleSubmit} className="space-y-4">
						<h3 className="font-heading text-lg text-stone-900">{t("profile.edit")}</h3>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="firstName" className="text-stone-700">
									{t("profile.firstName")}
								</Label>
								<Input
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="lastName" className="text-stone-700">
									{t("profile.lastName")}
								</Label>
								<Input
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="phone" className="text-stone-700">
								{t("profile.phone")}
							</Label>
							<Input
								id="phone"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder={t("profile.phone")}
								className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
							/>
						</div>

						<div className="flex gap-2">
							<Button type="submit" disabled={updateMutation.isPending}>
								{t("common.save")}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={updateMutation.isPending}
							>
								{t("common.cancel")}
							</Button>
						</div>
					</form>
				</>
			)}
		</div>
	);
}

function ProfileInfoSkeleton() {
	return (
		<div className="rounded-lg border border-stone-100 bg-stone-50/50 p-6">
			<div className="flex items-start gap-4">
				<div className="h-16 w-16 animate-pulse rounded-full bg-stone-200" />
				<div className="flex-1 space-y-3">
					<div className="h-5 w-40 rounded bg-stone-200" />
					<div className="h-4 w-24 rounded bg-stone-200" />
					<div className="h-4 w-56 rounded bg-stone-200" />
				</div>
			</div>
		</div>
	);
}

function MyItemsTab() {
	const { t } = useTranslation();
	const { data, isLoading } = useMyItems({ pageNumber: 1, pageSize: 20 });

	if (isLoading) {
		return (
			<div className="space-y-3">
				<ItemCardSkeleton />
				<ItemCardSkeleton />
				<ItemCardSkeleton />
			</div>
		);
	}

	if (!data?.items || data.items.length === 0) {
		return (
			<EmptyState
				icon={PackageSearch}
				message={t("profile.noItems")}
				subMessage={t("profile.noItemsSub")}
				actionLabel={t("items.addItem")}
				onAction={() => (window.location.href = "/items/new")}
			/>
		);
	}

	return (
		<div className="space-y-3">
			{data.items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</div>
	);
}

function MyClaimsTab() {
	const { t } = useTranslation();
	const { data, isLoading } = useMyClaims({ pageNumber: 1, pageSize: 20 });

	if (isLoading) {
		return <ListSkeleton count={4} />;
	}

	if (!data?.claims || data.claims.length === 0) {
		return (
			<EmptyState
				icon={PackageSearch}
				message={t("profile.noClaims")}
				subMessage={t("profile.noClaimsSub")}
			/>
		);
	}

	return (
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
							<h3 className="truncate text-sm font-semibold text-stone-900">{claim.itemTitle}</h3>
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
	);
}
