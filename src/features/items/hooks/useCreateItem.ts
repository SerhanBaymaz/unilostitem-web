import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { itemsApi } from "../api/itemsApi";

export function useCreateItem() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	return useMutation({
		mutationFn: itemsApi.createItem,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
			toast.success(`${t("items.addItem")} — ${t("common.save")}`);
			navigate(`/items/${data.id}`);
		},
		onError: () => {
			toast.error(t("common.error"));
		},
	});
}
