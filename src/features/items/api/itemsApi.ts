import apiClient from "@/shared/lib/axios";
import type { Pagination, StandardApiResponse } from "@/shared/types";
import type {
	Item,
	ItemCreateRequest,
	ItemListParams,
	ItemUpdateRequest,
} from "../types";

const BASE = "/api/v1/items";

interface ItemListResponse {
	items: Item[];
	pagination: Pagination;
}

export const itemsApi = {
	getItems: async (params?: ItemListParams): Promise<ItemListResponse> => {
		const res = await apiClient.get<StandardApiResponse<Item[]>>(BASE, {
			params,
		});
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch items");
		}
		const pagination = res.data.pagination;
		if (!pagination) {
			throw new Error("Pagination data missing from response");
		}
		return {
			items: res.data.data,
			pagination,
		};
	},

	getItemById: async (id: string): Promise<Item> => {
		const res = await apiClient.get<StandardApiResponse<Item>>(`${BASE}/${id}`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch item");
		}
		return res.data.data;
	},

	createItem: async (data: ItemCreateRequest): Promise<Item> => {
		const res = await apiClient.post<StandardApiResponse<Item>>(BASE, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to create item");
		}
		return res.data.data;
	},

	updateItem: async (id: string, data: ItemUpdateRequest): Promise<Item> => {
		const res = await apiClient.put<StandardApiResponse<Item>>(
			`${BASE}/${id}`,
			data,
		);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to update item");
		}
		return res.data.data;
	},

	getMyItems: async (params?: ItemListParams): Promise<ItemListResponse> => {
		const res = await apiClient.get<StandardApiResponse<Item[]>>(
			`${BASE}/my-items`,
			{ params },
		);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch my items");
		}
		const pagination = res.data.pagination;
		if (!pagination) {
			throw new Error("Pagination data missing from response");
		}
		return { items: res.data.data, pagination };
	},

	deleteItem: async (id: string): Promise<void> => {
		const res = await apiClient.delete<StandardApiResponse<null>>(
			`${BASE}/${id}`,
		);
		if (!res.data.success) {
			throw new Error(res.data.message ?? "Failed to delete item");
		}
	},
};
