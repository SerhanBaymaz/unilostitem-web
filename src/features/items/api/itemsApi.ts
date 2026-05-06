import apiClient from "@/shared/lib/axios";
import type { Category, Pagination, StandardApiResponse } from "@/shared/types";
import type { Item, ItemCreateRequest, ItemListParams, ItemUpdateRequest } from "../types";

const BASE = "/api/v1/items";

interface ApiItem {
	id: string;
	title: string;
	description: string;
	category: string;
	itemType: string;
	status: string;
	incidentDate: string;
	imageUrl?: string;
	locationLabel?: string;
	latitude?: number;
	longitude?: number;
	userId: string;
	userFullName: string;
	claimCount?: number;
	createdDate: string;
	updatedDate?: string;
}

function mapCategory(raw: string): Category {
	const valid: readonly string[] = [
		"Electronics",
		"IdentificationCard",
		"BagWallet",
		"ClothingAccessory",
		"BookStationery",
		"Key",
		"Documents",
		"HealthMedical",
		"Other",
	];
	return (valid.includes(raw) ? raw : "Other") as Category;
}

function mapItem(raw: ApiItem): Item {
	return {
		id: raw.id,
		title: raw.title,
		description: raw.description,
		category: mapCategory(raw.category),
		itemType: raw.itemType as Item["itemType"],
		status: raw.status as Item["status"],
		incidentDate: raw.incidentDate,
		imageUrl: raw.imageUrl,
		locationLabel: raw.locationLabel,
		latitude: raw.latitude,
		longitude: raw.longitude,
		ownerId: raw.userId,
		ownerName: raw.userFullName,
		claimCount: raw.claimCount,
		createdAt: raw.createdDate,
		updatedAt: raw.updatedDate,
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

interface ItemListResponse {
	items: Item[];
	pagination: Pagination;
}

export const itemsApi = {
	getItems: async (params?: ItemListParams): Promise<ItemListResponse> => {
		const res = await apiClient.get<StandardApiResponse<ApiItem[]>>(BASE, {
			params,
		});
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch items");
		}
		return {
			items: res.data.data.map(mapItem),
			pagination: extractPagination(res.data),
		};
	},

	getItemById: async (id: string): Promise<Item> => {
		const res = await apiClient.get<StandardApiResponse<ApiItem>>(`${BASE}/${id}`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch item");
		}
		return mapItem(res.data.data);
	},

	createItem: async (data: ItemCreateRequest): Promise<Item> => {
		const res = await apiClient.post<StandardApiResponse<ApiItem>>(BASE, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to create item");
		}
		return mapItem(res.data.data);
	},

	updateItem: async (id: string, data: ItemUpdateRequest): Promise<Item> => {
		const res = await apiClient.put<StandardApiResponse<ApiItem>>(`${BASE}/${id}`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to update item");
		}
		return mapItem(res.data.data);
	},

	getMyItems: async (params?: ItemListParams): Promise<ItemListResponse> => {
		const res = await apiClient.get<StandardApiResponse<ApiItem[]>>(`${BASE}/my-items`, {
			params,
		});
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch my items");
		}
		return {
			items: res.data.data.map(mapItem),
			pagination: extractPagination(res.data),
		};
	},

	deleteItem: async (id: string): Promise<void> => {
		const res = await apiClient.delete<StandardApiResponse<null>>(`${BASE}/${id}`);
		if (!res.data.success) {
			throw new Error(res.data.message ?? "Failed to delete item");
		}
	},
};
