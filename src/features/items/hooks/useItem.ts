import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "../api/itemsApi";

export function useItem(id: string) {
	return useQuery({
		queryKey: ["items", id],
		queryFn: () => itemsApi.getItemById(id),
		enabled: !!id,
		staleTime: 2 * 60 * 1000,
	});
}
