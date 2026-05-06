import apiClient from "@/shared/lib/axios";
import type { Pagination, StandardApiResponse } from "@/shared/types";
import type {
	Claim,
	ClaimAdminReviewRequest,
	ClaimCreateRequest,
	ClaimListParams,
	ClaimResponseRequest,
} from "../types";

const BASE = "/api/v1/claims";

interface ClaimListResponse {
	claims: Claim[];
	pagination: Pagination;
}

export const claimsApi = {
	getClaimsByItem: async (
		lostItemId: string,
		params?: Omit<ClaimListParams, "pageNumber" | "pageSize">,
	): Promise<ClaimListResponse> => {
		const res = await apiClient.get<StandardApiResponse<Claim[]>>(`${BASE}/by-item/${lostItemId}`, {
			params,
		});
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch claims");
		}
		const pagination = res.data.pagination;
		if (!pagination) {
			throw new Error("Pagination data missing from response");
		}
		return { claims: res.data.data, pagination };
	},

	getMyClaims: async (params?: ClaimListParams): Promise<ClaimListResponse> => {
		const res = await apiClient.get<StandardApiResponse<Claim[]>>(`${BASE}/my-claims`, { params });
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch my claims");
		}
		const pagination = res.data.pagination;
		if (!pagination) {
			throw new Error("Pagination data missing from response");
		}
		return { claims: res.data.data, pagination };
	},

	getClaimById: async (id: string): Promise<Claim> => {
		const res = await apiClient.get<StandardApiResponse<Claim>>(`${BASE}/${id}`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch claim");
		}
		return res.data.data;
	},

	getPendingClaims: async (params?: ClaimListParams): Promise<ClaimListResponse> => {
		const res = await apiClient.get<StandardApiResponse<Claim[]>>(`${BASE}/pending`, { params });
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch pending claims");
		}
		const pagination = res.data.pagination;
		if (!pagination) {
			throw new Error("Pagination data missing from response");
		}
		return { claims: res.data.data, pagination };
	},

	createClaim: async (data: ClaimCreateRequest): Promise<Claim> => {
		const res = await apiClient.post<StandardApiResponse<Claim>>(BASE, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to create claim");
		}
		return res.data.data;
	},

	cancelClaim: async (id: string): Promise<Claim> => {
		const res = await apiClient.put<StandardApiResponse<Claim>>(`${BASE}/${id}/cancel`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to cancel claim");
		}
		return res.data.data;
	},

	respondToClaim: async (id: string, data: ClaimResponseRequest): Promise<Claim> => {
		const res = await apiClient.put<StandardApiResponse<Claim>>(`${BASE}/${id}/respond`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to respond to claim");
		}
		return res.data.data;
	},

	adminReviewClaim: async (id: string, data: ClaimAdminReviewRequest): Promise<Claim> => {
		const res = await apiClient.put<StandardApiResponse<Claim>>(`${BASE}/${id}/admin-review`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to review claim");
		}
		return res.data.data;
	},
};
