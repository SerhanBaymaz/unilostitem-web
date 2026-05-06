import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { itemsApi } from "../api/itemsApi";
import type { ItemListParams } from "../types";

export function useItems(params?: ItemListParams) {
	return useQuery({
		queryKey: ["items", params],
		queryFn: () => itemsApi.getItems(params),
		placeholderData: keepPreviousData,
		staleTime: 2 * 60 * 1000,
	});
}
