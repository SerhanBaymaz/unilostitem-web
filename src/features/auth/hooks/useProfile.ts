import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useProfile() {
	return useQuery({
		queryKey: ["auth", "profile"],
		queryFn: authApi.getProfile,
		staleTime: 5 * 60 * 1000,
	});
}
