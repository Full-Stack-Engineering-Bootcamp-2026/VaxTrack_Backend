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

    async findTimelineByDependent(dependentId: number): Promise<VaccinationRecord[]> {
        return this.repository.find({
            where: { dependent: { id: dependentId } }, relations: { vaccine: true }, order: {
                dueDate: "ASC",
            }
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

    async findUpcomingVaccines(guardianId?: number): Promise<VaccinationRecord[]> {
        if (guardianId) {  //guardian
            return this.repository.find({
                where: { status: status.UPCOMING, dependent: { guardian: { id: guardianId } } }, relations: {
                    vaccine: true,
                    dependent: true
                },
                order: {
                    dueDate: "ASC"
                },
                take: 10
            });
        }
        return this.repository.find({
            where: { status: status.UPCOMING }, relations: {
                vaccine: true,
                dependent: true
            },
            order: {
                dueDate: "ASC"
            },
            take: 10
        });
    }

    async findOverdueVaccines(guardianId?: number): Promise<VaccinationRecord[]> {
        if (guardianId) {  //guardian
            return this.repository.find({
                where: { status: status.OVERDUE, dependent: { guardian: { id: guardianId } } }, relations: {
                    vaccine: true,
                    dependent: true
                },
                order: {
                    dueDate: "ASC"
                },
            });
        }
        return this.repository.find({
            where: { status: status.OVERDUE }, relations: {
                vaccine: true,
                dependent: true
            },
            order: {
                dueDate: "ASC"
            }
        });
    }
    async createMany(records: Partial<VaccinationRecord>[]): Promise<VaccinationRecord[]> {
        const vaccinationRecords = this.repository.create(records);

        return this.repository.save(vaccinationRecords);
    }

}