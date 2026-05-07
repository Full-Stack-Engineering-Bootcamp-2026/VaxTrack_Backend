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

    async findRecentActivities(userId?: number): Promise<Activity[]> {

        if (userId) {
            return this.repository.find({
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
                take: 10,
            });
        }

        return this.repository.find({
            relations: {
                user: true,
            },
            order: {
                createdAt: "DESC",
            },
            take: 10,
        });
    }

    async findAll(userId?: number): Promise<Activity[]> {

        if (userId) {
            return this.repository.find({
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
            });
        }

        return this.repository.find({
            relations: {
                user: true,
            },
            order: {
                createdAt: "DESC",
            },
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