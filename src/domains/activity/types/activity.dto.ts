export interface ActivityOutDto {
    id: number;
    action: string;
    description: string;
    entityType?: string;
    entityId?: string;
    createdAt: Date;
}

export interface CreateActivityDto {
    action: string;
    description?: string;
    entityType?: string;
    entityId?: string;
}