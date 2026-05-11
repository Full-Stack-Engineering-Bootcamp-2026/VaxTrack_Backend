import { Service } from "typedi";
import { Repository } from "typeorm";

import { AppDataSource } from "../../../db/db";

import { Activity } from "../entities/activity.entity";

@Service()
export class ActivityRepository {

    private repository: Repository<Activity>;

    constructor() {
        this.repository = AppDataSource.getRepository(Activity);
    }

    async create(data: Partial<Activity>): Promise<Activity> {

        const activity =
            this.repository.create(data);

        return this.repository.save(activity);
    }

    async findRecentActivities(page: number, limit: number, userId?: number): Promise<[Activity[], number]> {

        if (userId) {
            return this.repository.findAndCount({
                where: {
                    user: {
                        id: userId,
                    },
                },
                relations: {
                    user: true,
                },
                order: {
                    createdAt: "DESC",
                },
                skip: (page - 1) * limit,
                take: limit,
            });
        }

        return this.repository.findAndCount({
            relations: {
                user: true,
            },
            order: {
                createdAt: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findAll(page: number, limit: number, userId?: number): Promise<[Activity[], number]> {

        if (userId) {

            return this.repository.findAndCount({
                where: {
                    user: {
                        id: userId,
                    },
                },
                relations: {
                    user: true,
                },
                order: {
                    createdAt: "DESC",
                },
                skip: (page - 1) * limit,
                take: limit,
            });
        }

        return this.repository.findAndCount({
            relations: {
                user: true,
            },
            order: {
                createdAt: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findById(id: number): Promise<Activity | null> {

        return this.repository.findOne({
            where: { id },
            relations: {
                user: true,
            },
        });
    }
}