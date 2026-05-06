import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { itemsApi } from "../api/itemsApi";

export function useUpdateItem(id: string) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: (data: Parameters<typeof itemsApi.updateItem>[1]) => itemsApi.updateItem(id, data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
			queryClient.setQueryData(["items", id], data);
			toast.success(t("common.save"));
			navigate(`/items/${data.id}`);
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});
}
