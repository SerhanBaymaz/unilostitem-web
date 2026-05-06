import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/types";
import { clearStoredTokens, setStoredTokens } from "@/shared/lib/axios";

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	setAuth: (user: User, accessToken: string, refreshToken: string) => void;
	setUser: (user: User) => void;
	logout: () => void;
	setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			isLoading: true,

			setAuth: (user, accessToken, refreshToken) => {
				setStoredTokens({ accessToken, refreshToken });
				set({ user, isAuthenticated: true, isLoading: false });
			},

			setUser: (user) => {
				set({ user });
			},

			logout: () => {
				clearStoredTokens();
				set({ user: null, isAuthenticated: false });
			},

			setLoading: (loading) => {
				set({ isLoading: loading });
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.setLoading(false);
				}
			},
		},
	),
);
