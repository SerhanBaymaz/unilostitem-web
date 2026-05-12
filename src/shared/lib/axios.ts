import axios from 'axios';
import type { StandardApiResponse } from '@/shared/types';
import { queryClient } from './queryClient';

const TOKEN_KEY = 'auth_tokens';
const REFRESH_ENDPOINT = '/api/v1/auth/refresh-token';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export function getStoredTokens(): StoredTokens | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as StoredTokens) : null;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: StoredTokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAccessToken(): string | null {
  return getStoredTokens()?.accessToken ?? null;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

function onTokenRefreshed(): void {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
}

apiClient.interceptors.request.use((config) => {
  const tokens = getStoredTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url === REFRESH_ENDPOINT) {
      queryClient.clear();
      clearStoredTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => {
          originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const tokens = getStoredTokens();
      if (!tokens?.refreshToken) {
        queryClient.clear();
        clearStoredTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      const { data } = await axios.post<StandardApiResponse<StoredTokens>>(
        `${apiClient.defaults.baseURL}${REFRESH_ENDPOINT}`,
        { refreshToken: tokens.refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (data.success && data.data) {
        setStoredTokens(data.data);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        onTokenRefreshed();
        return apiClient(originalRequest);
      }
    } catch {
      queryClient.clear();
      clearStoredTokens();
      window.location.href = '/login';
    } finally {
      isRefreshing = false;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
