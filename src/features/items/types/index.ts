import type { Category, ItemStatus, ItemType } from '@/shared/types';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  itemType: ItemType;
  incidentDate: string;
  imageUrl?: string;
  contactInfo?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  status: ItemStatus;
  ownerId: string;
  ownerName: string;
  claimCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ItemCreateRequest {
  title: string;
  description: string;
  category: Category;
  itemType: ItemType;
  incidentDate: string;
  imageUrl?: string;
  contactInfo?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
}

export type ItemUpdateRequest = Partial<ItemCreateRequest>;

export interface ItemListParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
  itemType?: ItemType;
  category?: Category;
  status?: string;
}
