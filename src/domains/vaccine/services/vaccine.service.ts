import { Service } from "typedi";
import { VaccineRepository } from "../repositories/vaccine.repository";
import { VaccineCreateDto } from "../types/vaccine.dto";
import { Vaccine } from "../entities/vaccine.entity";

@Service()
export class VaccineService {
    constructor(private repo: VaccineRepository) { }

    async create(data: VaccineCreateDto): Promise<Vaccine> {
        return this.repo.create(data);
    }

    async findAll(): Promise<Vaccine[]> {
        return this.repo.findAll();
    }

    async find(id: number): Promise<Vaccine | null> {
        return this.repo.find(id);
    }

    async update(id: number, data: Partial<VaccineCreateDto>): Promise<Vaccine> {
        return this.repo.update(id, data);
    }

    async delete(id: number) {
        return this.repo.delete(id);
    }
}