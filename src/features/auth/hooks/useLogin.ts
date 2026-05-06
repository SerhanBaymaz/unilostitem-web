import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export function useLogin() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((s) => s.setAuth);
	const { t } = useTranslation();

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: (data) => {
			setAuth(data.user, data.accessToken, data.refreshToken);
			toast.success(t("auth.loginSuccess"));
			navigate("/");
		},
		onError: () => {
			toast.error(t("auth.invalidCredentials"));
		},
	});
}
