import type { ClaimStatus } from "@/shared/types";

export interface Claim {
  id: string;
  lostItemId: string;
  itemTitle: string;
  itemImageUrl?: string;
  claimantId: string;
  claimantName: string;
  ownerId?: string;
  ownerName?: string;
  description: string;
  status: ClaimStatus;
  adminNote?: string;
  responseDescription?: string;
  createdAt: string;
  updatedAt?: string;
  respondedAt?: string;
  adminReviewedAt?: string;
  expiresAt?: string;
}

export interface ClaimCreateRequest {
  lostItemId: string;
  description: string;
}

export interface ClaimResponseRequest {
  isApproved: boolean;
  responseDescription?: string;
}

export interface ClaimAdminReviewRequest {
  isApproved: boolean;
  adminNote?: string;
}

export interface ClaimListParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  status?: ClaimStatus;
  searchTerm?: string;
}
