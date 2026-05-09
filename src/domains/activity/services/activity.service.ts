import { Service } from "typedi";

import { ActivityRepository } from "../repositories/activity.repository";

import {
    Activity,
    ActivityAction,
} from "../entities/activity.entity";

import { UserRole } from "../../user/entities/user.entity";

import { NotFoundException } from "../../../common/exceptions";
import { LoggerService } from "../../../common/utils/logger.service";

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

    public async getRecentActivities(userId: number, role: UserRole): Promise<Activity[]> {

        this.logger.info(`Fetching recent activities`);
        return this.repository.findRecentActivities(
            role === UserRole.GUARDIAN
                ? userId
                : undefined
        );
    }

    public async getAllActivities(userId: number, role: UserRole): Promise<Activity[]> {
        this.logger.info(`Fetching all activities`);
        return this.repository.findAll(
            role === UserRole.GUARDIAN
                ? userId
                : undefined
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
}