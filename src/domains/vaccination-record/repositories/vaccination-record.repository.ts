import { Service } from "typedi";
import { LessThan, Not, Repository } from "typeorm";
import { status, VaccinationRecord } from "../entities/vaccination-record.entity";
import { AppDataSource } from "../../../db/db";

@Service()
export class VaccinationRecordRepository {
    private repository: Repository<VaccinationRecord>;
    constructor() {
        this.repository = AppDataSource.getRepository(VaccinationRecord);
    }

    async findById(id: number): Promise<VaccinationRecord | null> {
        return this.repository.findOne({
            where: { id }, relations: {
                dependent: true,
                vaccine: true,
                administeredBy: true
            }
        });
    }

    async update(id: number, data: Partial<VaccinationRecord>): Promise<void> {
        await this.repository.update(id, data);
    }

    async findTimelineByDependent(dependentId: number, page: number, limit: number): Promise<[VaccinationRecord[], number]> {

        return this.repository.findAndCount({

            where: {
                dependent: {
                    id: dependentId,
                },
            },
            relations: {
                vaccine: true,
            },
            order: {
                dueDate: "ASC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOverDueVaccines(): Promise<VaccinationRecord[]> {
        return this.repository.find({ where: { dueDate: LessThan(new Date()), status: Not(status.COMPLETED) } });
    }

    async countCompleted(guardianId?: number): Promise<number> {
        if (guardianId) {  //guardian
            return this.repository.count({
                where: { status: status.COMPLETED, dependent: { guardian: { id: guardianId } } }, relations: {
                    dependent: {
                        guardian: true
                    }
                }
            });
        }
        return this.repository.count({ where: { status: status.COMPLETED } }); //admin and staff
    }

    async countUpcoming(guardianId?: number): Promise<number> {
        if (guardianId) {  //guardian
            return this.repository.count({
                where: { status: status.UPCOMING, dependent: { guardian: { id: guardianId } } }, relations: {
                    dependent: {
                        guardian: true
                    }
                }
            });
        }
        return this.repository.count({ where: { status: status.UPCOMING } }); //admin and staff
    }

    async countOverdue(guardianId?: number): Promise<number> {
        if (guardianId) {  //guardian
            return this.repository.count({
                where: { status: status.OVERDUE, dependent: { guardian: { id: guardianId } } }, relations: {
                    dependent: {
                        guardian: true
                    }
                }
            });
        }
        return this.repository.count({ where: { status: status.OVERDUE } }); //admin and staff
    }

    async findUpcomingVaccines(page: number, limit: number, guardianId?: number): Promise<[VaccinationRecord[], number]> {

        if (guardianId) {

            return this.repository.findAndCount({
                where: {
                    status: status.UPCOMING,
                    dependent: {
                        guardian: {
                            id: guardianId,
                        },
                    },
                },

                relations: {
                    vaccine: true,
                    dependent: true,
                },
                order: {
                    dueDate: "ASC",
                },
                skip: (page - 1) * limit,
                take: limit,
            });
        }

        return this.repository.findAndCount({
            where: {
                status: status.UPCOMING,
            },
            relations: {
                vaccine: true,
                dependent: true,
            },
            order: {
                dueDate: "ASC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findOverdueVaccines(page: number, limit: number, guardianId?: number): Promise<[VaccinationRecord[], number]> {

        if (guardianId) {

            return this.repository.findAndCount({
                where: {
                    status: status.OVERDUE,
                    dependent: {
                        guardian: {
                            id: guardianId,
                        },
                    },
                },

                relations: {
                    vaccine: true,
                    dependent: true,
                },
                order: {
                    dueDate: "ASC",
                },
                skip: (page - 1) * limit,
                take: limit,
            });
        }

        return this.repository.findAndCount({
            where: {
                status: status.OVERDUE,
            },
            relations: {
                vaccine: true,
                dependent: true,
            },
            order: {
                dueDate: "ASC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async createMany(records: Partial<VaccinationRecord>[]): Promise<VaccinationRecord[]> {
        const vaccinationRecords = this.repository.create(records);

        return this.repository.save(vaccinationRecords);
    }

}