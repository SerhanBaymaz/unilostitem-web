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

function mapClaim(data: any): Claim {
	return {
		id: data.id,
		lostItemId: data.lostItemId,
		itemTitle: data.lostItemTitle || data.itemTitle,
		itemImageUrl: data.itemImageUrl,
		claimantId: data.claimantId,
		claimantName: data.claimantFullName || data.claimantName,
		ownerId: data.ownerId,
		ownerName: data.ownerName,
		description: data.description,
		status: data.status,
		adminNote: data.adminComment || data.adminNote,
		responseDescription: data.ownerComment || data.responseDescription,
		createdAt: data.createdDate || data.createdAt,
		updatedAt: data.updatedDate || data.updatedAt,
		respondedAt: data.ownerResponseDate || data.respondedAt,
		adminReviewedAt: data.reviewedDate || data.adminReviewedAt,
		expiresAt: data.expiresAt,
	};
}

function extractPagination(res: StandardApiResponse<unknown[]>): Pagination {
	const meta = res.metadata;
	const pag = res.pagination;
	if (pag) return pag;
	if (meta) {
		return {
			pageNumber: meta.pageNumber,
			pageSize: meta.pageSize,
			totalPages: meta.totalPages,
			totalCount: meta.totalCount,
		};
	}
	throw new Error("Pagination data missing from response");
}

interface ClaimListResponse {
	claims: Claim[];
	pagination: Pagination;
}

export const claimsApi = {
	getClaimsByItem: async (
		lostItemId: string,
		params?: Omit<ClaimListParams, "pageNumber" | "pageSize">,
	): Promise<ClaimListResponse> => {
		const res = await apiClient.get<StandardApiResponse<any[]>>(`${BASE}/by-item/${lostItemId}`, {
			params,
		});
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch claims");
		}
		return {
			claims: res.data.data.map(mapClaim),
			pagination: extractPagination(res.data),
		};
	},

	getMyClaims: async (params?: ClaimListParams): Promise<ClaimListResponse> => {
		const res = await apiClient.get<StandardApiResponse<any[]>>(`${BASE}/my-claims`, { params });
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch my claims");
		}
		return {
			claims: res.data.data.map(mapClaim),
			pagination: extractPagination(res.data),
		};
	},

	getClaimById: async (id: string): Promise<Claim> => {
		const res = await apiClient.get<StandardApiResponse<any>>(`${BASE}/${id}`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch claim");
		}
		return mapClaim(res.data.data);
	},

	getPendingClaims: async (params?: ClaimListParams): Promise<ClaimListResponse> => {
		const res = await apiClient.get<StandardApiResponse<any[]>>(`${BASE}/pending`, { params });
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch pending claims");
		}
		return {
			claims: res.data.data.map(mapClaim),
			pagination: extractPagination(res.data),
		};
	},

	createClaim: async (data: ClaimCreateRequest): Promise<Claim> => {
		const res = await apiClient.post<StandardApiResponse<any>>(BASE, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to create claim");
		}
		return mapClaim(res.data.data);
	},

	cancelClaim: async (id: string): Promise<Claim> => {
		const res = await apiClient.put<StandardApiResponse<any>>(`${BASE}/${id}/cancel`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to cancel claim");
		}
		return mapClaim(res.data.data);
	},

	respondToClaim: async (id: string, data: ClaimResponseRequest): Promise<Claim> => {
		const res = await apiClient.put<StandardApiResponse<any>>(`${BASE}/${id}/respond`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to respond to claim");
		}
		return mapClaim(res.data.data);
	},

	adminReviewClaim: async (id: string, data: ClaimAdminReviewRequest): Promise<Claim> => {
		const res = await apiClient.put<StandardApiResponse<any>>(`${BASE}/${id}/admin-review`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to review claim");
		}
		return mapClaim(res.data.data);
	},
};
