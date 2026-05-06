import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { itemsApi } from "../api/itemsApi";

export function useDeleteItem() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: itemsApi.deleteItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
			toast.success(t("items.deleteItem"));
			navigate("/");
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});
}
