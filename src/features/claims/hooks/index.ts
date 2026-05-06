import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { claimsApi } from "../api/claimsApi";
import type {
	ClaimAdminReviewRequest,
	ClaimListParams,
	ClaimResponseRequest,
} from "../types";

export function useClaimsByItem(
	lostItemId: string,
	params?: Omit<ClaimListParams, "pageNumber" | "pageSize">,
) {
	return useQuery({
		queryKey: ["claims", "by-item", lostItemId, params],
		queryFn: () => claimsApi.getClaimsByItem(lostItemId, params),
		enabled: !!lostItemId,
		placeholderData: keepPreviousData,
		staleTime: 2 * 60 * 1000,
	});
}

export function useMyClaims(params?: ClaimListParams) {
	return useQuery({
		queryKey: ["claims", "my-claims", params],
		queryFn: () => claimsApi.getMyClaims(params),
		placeholderData: keepPreviousData,
		staleTime: 2 * 60 * 1000,
	});
}

export function useClaim(id: string) {
	return useQuery({
		queryKey: ["claims", id],
		queryFn: () => claimsApi.getClaimById(id),
		enabled: !!id,
		staleTime: 2 * 60 * 1000,
	});
}

export function usePendingClaims(params?: ClaimListParams) {
	return useQuery({
		queryKey: ["claims", "pending", params],
		queryFn: () => claimsApi.getPendingClaims(params),
		placeholderData: keepPreviousData,
		staleTime: 60 * 1000,
	});
}

export function useCreateClaim() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: claimsApi.createClaim,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["claims"] });
			toast.success(t("claims.createSuccess"));
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});
}

export function useCancelClaim() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: claimsApi.cancelClaim,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["claims"] });
			toast.success(t("claims.cancelSuccess"));
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});
}

export function useRespondToClaim(id: string) {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: (data: ClaimResponseRequest) =>
			claimsApi.respondToClaim(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["claims"] });
			queryClient.invalidateQueries({ queryKey: ["items"] });
			toast.success(t("claims.respondSuccess"));
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});
}

export function useAdminReviewClaim(id: string) {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: (data: ClaimAdminReviewRequest) =>
			claimsApi.adminReviewClaim(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["claims"] });
			toast.success(t("claims.respondSuccess"));
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});
}
