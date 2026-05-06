import apiClient from "@/shared/lib/axios";
import type { StandardApiResponse } from "@/shared/types";
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	UpdateProfileRequest,
	User,
} from "../types";

const BASE = "/api/v1/auth";

export const authApi = {
	login: async (data: LoginRequest): Promise<AuthResponse> => {
		const res = await apiClient.post<StandardApiResponse<AuthResponse>>(`${BASE}/login`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Login failed");
		}
		return res.data.data;
	},

	register: async (data: RegisterRequest): Promise<AuthResponse> => {
		const res = await apiClient.post<StandardApiResponse<AuthResponse>>(`${BASE}/register`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Registration failed");
		}
		return res.data.data;
	},

	getProfile: async (): Promise<User> => {
		const res = await apiClient.get<StandardApiResponse<User>>(`${BASE}/profile`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch profile");
		}
		return res.data.data;
	},

	updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
		const res = await apiClient.put<StandardApiResponse<User>>(`${BASE}/profile`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to update profile");
		}
		return res.data.data;
	},
};
