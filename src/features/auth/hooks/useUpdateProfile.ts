import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import type { UpdateProfileRequest } from '../types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      toast.success(t('profile.updateSuccess'));
    },
    onError: () => {
      toast.error(t('common.error'));
    },
  });
}
