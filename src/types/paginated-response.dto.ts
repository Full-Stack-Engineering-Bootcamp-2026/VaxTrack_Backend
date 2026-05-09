export interface PaginatedResponseDto<T> {
    data: T[];
    pagination: {
        page: number,
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}