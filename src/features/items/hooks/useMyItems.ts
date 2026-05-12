import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { itemsApi } from '../api/itemsApi';
import type { ItemListParams } from '../types';

export function useMyItems(params?: ItemListParams) {
  return useQuery({
    queryKey: ['items', 'my-items', params],
    queryFn: () => itemsApi.getMyItems(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
}
