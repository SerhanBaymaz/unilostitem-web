import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/features/auth/store/authStore';
import { queryClient } from '@/shared/lib/queryClient';

describe('Auth Logout Cache Invalidation', () => {
  beforeEach(() => {
    // Her testten önce durumu sıfırlayalım
    queryClient.clear();
    useAuthStore.getState().logout();
  });

  it('should clear react-query cache when logout is called', async () => {
    // 1. Önce cache'e sahte bir veri ekleyelim
    const testKey = ['items', 'my-items'];
    const testData = [{ id: 1, name: 'Ahmetin Eşyası' }];

    queryClient.setQueryData(testKey, testData);

    // 2. Verinin cache'e girdiğinden emin olalım
    expect(queryClient.getQueryData(testKey)).toEqual(testData);

    // 3. Logout işlemini tetikleyelim
    useAuthStore.getState().logout();

    // 4. Cache'in temizlendiğini kontrol edelim
    const cachedData = queryClient.getQueryData(testKey);
    expect(cachedData).toBeUndefined();
  });

  it('should clear user state when logout is called', () => {
    // 1. Sahte bir kullanıcı girişi yapalım
    const testUser = {
      id: '1',
      email: 'ahmet@test.com',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      role: 'User' as const,
      createdAt: new Date().toISOString(),
    };
    useAuthStore.getState().setAuth(testUser, 'access', 'refresh');

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).toEqual(testUser);

    // 2. Logout yapalım
    useAuthStore.getState().logout();

    // 3. State'in sıfırlandığını kontrol edelim
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
