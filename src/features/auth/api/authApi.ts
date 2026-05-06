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

interface ApiLoginResponse {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	accessToken: string;
	refreshToken: string;
	roles: string[];
}

function mapUser(raw: Partial<ApiLoginResponse> & { id: string; email: string }): User {
	const roleStr = raw.roles?.[0] ?? "BaseUser";
	return {
		id: raw.id,
		email: raw.email,
		firstName: raw.firstName ?? "",
		lastName: raw.lastName ?? "",
		phoneNumber: raw.phoneNumber,
		role: roleStr === "Admin" ? "Admin" : "User",
		createdAt: "",
	};
}

export const authApi = {
	login: async (data: LoginRequest): Promise<AuthResponse> => {
		const res = await apiClient.post<StandardApiResponse<ApiLoginResponse>>(`${BASE}/login`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Login failed");
		}
		const raw = res.data.data;
		return {
			accessToken: raw.accessToken,
			refreshToken: raw.refreshToken,
			user: mapUser(raw),
		};
	},

	register: async (data: RegisterRequest): Promise<AuthResponse> => {
		const res = await apiClient.post<StandardApiResponse<ApiLoginResponse>>(
			`${BASE}/register`,
			data,
		);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Registration failed");
		}
		const raw = res.data.data;
		return {
			accessToken: raw.accessToken,
			refreshToken: raw.refreshToken,
			user: mapUser(raw),
		};
	},

	getProfile: async (): Promise<User> => {
		const res = await apiClient.get<StandardApiResponse<ApiLoginResponse>>(`${BASE}/profile`);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to fetch profile");
		}
		return mapUser(res.data.data);
	},

	updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
		const res = await apiClient.put<StandardApiResponse<ApiLoginResponse>>(`${BASE}/profile`, data);
		if (!res.data.success || !res.data.data) {
			throw new Error(res.data.message ?? "Failed to update profile");
		}
		return mapUser(res.data.data);
	},
};
