import { Calendar, Mail, Phone, Shield, UserCircle } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useProfile, useUpdateProfile } from "@/features/auth/hooks";
import { EmptyState, PhoneInput } from "@/shared/components";

function formatDate(dateStr: string): string {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

export default function ProfilePage() {
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
		<div className="mx-auto max-w-3xl p-4 md:p-6">
			<h1 className="mb-6 font-heading text-2xl text-stone-900 md:text-[28px] dark:text-stone-50">
				{t("profile.title")}
			</h1>

			<div className="space-y-6">
				{/* Profile Card */}
				<div className="rounded-lg border border-stone-100 bg-stone-50/50 p-6 dark:border-stone-800 dark:bg-stone-900/50">
					<div className="flex items-start gap-4">
						<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl font-semibold text-amber-700 dark:bg-amber-950/50">
							{initials}
						</div>
						<div className="flex-1 space-y-3">
							<div>
								<h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
									{profile.firstName} {profile.lastName}
								</h2>
								<span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/50">
									<Shield className="h-3 w-3" />
									{profile.role}
								</span>
							</div>

							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
									<Mail className="h-4 w-4 text-stone-400 dark:text-stone-500" />
									{profile.email}
								</div>
								{profile.phoneNumber && (
									<div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
										<Phone className="h-4 w-4 text-stone-400 dark:text-stone-500" />
										{profile.phoneNumber}
									</div>
								)}
								<div className="flex items-center gap-2 text-stone-400 dark:text-stone-500">
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
							<h3 className="font-heading text-lg text-stone-900 dark:text-stone-50">
								{t("profile.edit")}
							</h3>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-1.5">
									<Label htmlFor="firstName" className="text-stone-700 dark:text-stone-300">
										{t("profile.firstName")}
									</Label>
									<Input
										id="firstName"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
									/>
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="lastName" className="text-stone-700 dark:text-stone-300">
										{t("profile.lastName")}
									</Label>
									<Input
										id="lastName"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										className="h-10 rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800/50 dark:placeholder:text-stone-500"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label htmlFor="phone" className="text-stone-700 dark:text-stone-300">
									{t("profile.phone")}
								</Label>
								<PhoneInput
									id="phone"
									value={phone}
									onChange={setPhone}
									placeholder="5XX XXX XX XX"
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
		</div>
	);
}

function ProfileInfoSkeleton() {
	return (
		<div className="mx-auto max-w-3xl p-4 md:p-6">
			<div className="mb-6 h-8 w-40 rounded bg-stone-200 dark:bg-stone-700" />
			<div className="rounded-lg border border-stone-100 bg-stone-50/50 p-6 dark:border-stone-800 dark:bg-stone-900/50">
				<div className="flex items-start gap-4">
					<div className="h-16 w-16 animate-pulse rounded-full bg-stone-200 dark:bg-stone-700" />
					<div className="flex-1 space-y-3">
						<div className="h-5 w-40 rounded bg-stone-200 dark:bg-stone-700" />
						<div className="h-4 w-24 rounded bg-stone-200 dark:bg-stone-700" />
						<div className="h-4 w-56 rounded bg-stone-200 dark:bg-stone-700" />
					</div>
				</div>
			</div>
		</div>
	);
}
