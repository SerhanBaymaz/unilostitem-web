import type { UserRole } from "@/shared/types";

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
	role: UserRole;
	createdAt: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface UpdateProfileRequest {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
}
