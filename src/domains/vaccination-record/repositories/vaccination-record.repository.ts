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
    async createMany(records: Partial<VaccinationRecord>[]): Promise<VaccinationRecord[]> {
        const vaccinationRecords = this.repository.create(records);

        return this.repository.save(vaccinationRecords);
    }
}