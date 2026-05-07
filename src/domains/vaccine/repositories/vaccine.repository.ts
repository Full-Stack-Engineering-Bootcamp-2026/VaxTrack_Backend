import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { VaccineCreateDto } from "../types/vaccine.dto";
import { Vaccine } from "../entities/vaccine.entity";
import { NotFoundException } from "../../../common/exceptions";

@Service()
export class VaccineRepository {
    private repository: Repository<Vaccine>;

    constructor() {
        this.repository = AppDataSource.getRepository(Vaccine);
    }
    async create(data: VaccineCreateDto): Promise<Vaccine> {
        const vaccine = this.repository.create(data);
        return this.repository.save(vaccine);
    }

    async findAll(): Promise<Vaccine[]> {
        return this.repository.find();
    }

    async findAllActive(): Promise<Vaccine[]> {
        return this.repository.find({ where: { isActive: true } });
    }
    async find(id: number): Promise<Vaccine | null> {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: number, data: Partial<VaccineCreateDto>): Promise<Vaccine> {
        await this.repository.update(id, data);
        const updated = await this.find(id);
        if (!updated)
            throw new Error("Vaccine not found");
        return updated;
    }

    async disable(id: number): Promise<boolean> {
        const result = await this.repository.update(id, {
            isActive: false,
        })

        return (result.affected ?? 0) > 0;
    }
}