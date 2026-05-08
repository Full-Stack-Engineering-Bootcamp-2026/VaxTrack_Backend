import { Service } from "typedi";
import { VaccineRepository } from "../repositories/vaccine.repository";
import { VaccineCreateDto } from "../types/vaccine.dto";
import { Vaccine } from "../entities/vaccine.entity";
import { NotFoundException } from "../../../common/exceptions";
import { UserRepository } from "../../user/repositories/user.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { ActivityService } from "../../activity/services/activity.service";
import { ActivityAction } from "../../activity/entities/activity.entity";

@Service()
export class VaccineService {
    constructor(
        private repo: VaccineRepository,
        private readonly repository: UserRepository,
        private readonly logger: LoggerService,
        private readonly activityService: ActivityService
    ) { }


    async create(staffId: number, data: VaccineCreateDto): Promise<Vaccine> {
        this.logger.info(
            `Creating vaccine: ${data.name}`
        );
        const vaccine = await this.repo.create(data);
        await this.activityService.logActivity(
            ActivityAction.VACCINE_CREATED,
            staffId,
            `Vaccine ${vaccine.name} created`,
            "vaccine",
            String(vaccine.id)
        );
        return vaccine
    }

    async findAll(): Promise<Vaccine[]> {
        return this.repo.findAll();
    }

    async findAllActive(): Promise<Vaccine[]> {
        return this.repo.findAllActive();
    }

    async find(id: number): Promise<Vaccine | null> {
        return this.repo.find(id);
    }

    async update(id: number, staffId: number, data: Partial<VaccineCreateDto>): Promise<Vaccine> {
        this.logger.info(`Updating vaccine ${id}`);
        await this.activityService.logActivity(
            ActivityAction.VACCINE_UPDATED,
            staffId,
            `Vaccine updated`,
            "vaccine",
            String(id)
        );
        return this.repo.update(id, data);
    }

    async disable(id: number, staffId: number) {
        const vaccine = await this.repo.find(id);
        if (!vaccine)
            throw new NotFoundException("Vaccine not found");

        this.logger.info(`Disabling vaccine ${id}`);

        await this.activityService.logActivity(
            ActivityAction.VACCINE_DISABLED,
            staffId,
            `Vaccine disabled`,
            "vaccine",
            String(id)
        );
        return this.repo.disable(id);
    }

}