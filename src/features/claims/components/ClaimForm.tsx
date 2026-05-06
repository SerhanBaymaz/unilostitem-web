import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const claimSchema = z.object({
	description: z.string().min(10, "claims.descriptionRequired"),
});

type ClaimFormData = z.infer<typeof claimSchema>;

interface ClaimFormProps {
	onSubmit: (data: { description: string }) => void;
	isPending: boolean;
}

export function ClaimForm({ onSubmit, isPending }: ClaimFormProps) {
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ClaimFormData>({
		resolver: zodResolver(claimSchema),
		defaultValues: { description: "" },
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1.5">
				<Label htmlFor="claim-description" className="text-stone-700">
					{t("claims.claimDescription")}
				</Label>
				<Textarea
					id="claim-description"
					placeholder={t("claims.descriptionPlaceholder")}
					rows={5}
					aria-invalid={!!errors.description}
					className="rounded-md border-stone-200 bg-stone-50 text-[15px] placeholder:text-stone-400 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
					{...register("description")}
				/>
				{errors.description?.message && (
					<p className="text-[13px] text-red-600">
						{t(errors.description.message)}
					</p>
				)}
			</div>

			<div className="flex gap-3 pt-2">
				<Button type="submit" disabled={isPending} className="flex-1">
					{t("claims.createClaim")}
				</Button>
			</div>
		</form>
	);
}
