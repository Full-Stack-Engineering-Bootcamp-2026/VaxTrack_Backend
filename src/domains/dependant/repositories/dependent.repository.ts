import { Service } from "typedi";
import { Repository } from "typeorm";
import { Dependent } from "../entities/dependent.entity";
import { AppDataSource } from "../../../db/db";
import { UpdateDependentDto } from "../types/dependent.dto";

@Service()
export class DependentRepository {
    private repository: Repository<Dependent>;

    constructor() {
        this.repository = AppDataSource.getRepository(Dependent);
    }

    async create(data: Partial<Dependent>): Promise<Dependent> {
        const dependent = this.repository.create(data);
        return this.repository.save(dependent);
    }

    async findAllByGuardian(guardianId: number): Promise<Dependent[]> {
        return this.repository.find({
            where: {
                guardian: {
                    id: guardianId,
                },
                isActive: true,
            },
            relations: {
                guardian: true,
            },
        });
    }
    async findById(dependentId: number, guardianId: number): Promise<Dependent | null> {
        return this.repository.findOne({
            where: {
                id: dependentId,
                guardian: {
                    id: guardianId,
                },
                isActive: true,
            },
            relations: {
                guardian: true,
            },
        });
    }

    async update(dependentId: number, data: UpdateDependentDto): Promise<void> {
        await this.repository.update(dependentId, data);
    }

    async softDelete(dependentId: number): Promise<void> {
        await this.repository.update(dependentId, {
            isActive: false,
        });
    }
    async getStats(guardianId: number) {

        const totalDependents = await this.repository.count({
            where: {
                guardian: {
                    id: guardianId,
                },
            },
        });

        const activeDependents = await this.repository.count({
            where: {
                guardian: {
                    id: guardianId,
                },
                isActive: true,
            },
        });

        return {
            totalDependents,
            activeDependents,
        };
    }
    async findByIdAndGuardian(dependentId: number, guardianId: number): Promise<Dependent | null> {

        return this.repository.findOne({
            where: {
                id: dependentId,
                guardian: {
                    id: guardianId,
                },
            },
        });
    }
}