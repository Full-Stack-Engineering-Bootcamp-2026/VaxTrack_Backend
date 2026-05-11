import { Service } from "typedi";

import { ActivityRepository } from "../repositories/activity.repository";

import {
    Activity,
    ActivityAction,
} from "../entities/activity.entity";

import { UserRole } from "../../user/entities/user.entity";

import { NotFoundException } from "../../../common/exceptions";
import { LoggerService } from "../../../common/utils/logger.service";
import { PaginatedResponseDto } from "../../../types/paginated-response.dto";

@Service()
export class ActivityService {

    constructor(
        private readonly repository: ActivityRepository,
        private readonly logger: LoggerService
    ) { }

    public async logActivity(action: ActivityAction, userId: number,
        description: string, entityType?: string,
        entityId?: string): Promise<void> {

        this.logger.info(`Logging activity ${action} for user ${userId}`);

        await this.repository.create({
            action,
            description,
            entityType,
            entityId,

            user: {
                id: userId,
            } as any,
        });
    }

public async getRecentActivities(
    page: number,
    limit: number,
    userId: number,
    role: UserRole
): Promise<PaginatedResponseDto<Activity>>{

        this.logger.info(`Fetching recent activities`);

        const [activities, total] = await this.repository.findRecentActivities(
            page,
            limit,
            role === UserRole.GUARDIAN ? userId : undefined
        );

        return this.buildPaginatedResponse(
            activities,
            total,
            page,
            limit
        );
    }

public async getAllActivities(
    page: number,
    limit: number,
    userId: number,
    role: UserRole
): Promise<PaginatedResponseDto<Activity>> {
        this.logger.info(`Fetching all activities`);
        const [activities, total] = await this.repository.findAll(
            page,
            limit,
            role === UserRole.GUARDIAN
                ? userId
                : undefined
        );
        return this.buildPaginatedResponse(
            activities,
            total,
            page,
            limit
        );
    }

    public async getById(id: number, userId: number, role: UserRole): Promise<Activity> {

        const activity = await this.repository.findById(id);

        if (!activity) {
            throw new NotFoundException(
                "Activity not found"
            );
        }
        if (
            role === UserRole.GUARDIAN &&
            activity.user.id !== userId
        ) {

            throw new NotFoundException(
                "Activity not found"
            );
        }

        return activity;
    }

    private buildPaginatedResponse(activities: Activity[], total: number, page: number, limit: number) {

        return {
            data: activities,
            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(total / limit),
                hasNextPage:
                    page < Math.ceil(total / limit),
                hasPreviousPage:
                    page > 1,
            },
        };
    }
}