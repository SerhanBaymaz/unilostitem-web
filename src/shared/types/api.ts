export interface Pagination {
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalCount: number;
}

export interface StandardApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	timestamp: string;
	traceId?: string;
	pagination?: Pagination;
}

export interface PagedResponse<T> extends StandardApiResponse<T[]> {
	pagination: Pagination;
}
