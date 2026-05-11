import { Service } from "typedi";
import { VaccineRepository } from "../repositories/vaccine.repository";
import { VaccineCreateDto } from "../types/vaccine.dto";
import { Vaccine } from "../entities/vaccine.entity";
import { NotFoundException } from "../../../common/exceptions";
import { UserRepository } from "../../user/repositories/user.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { ActivityService } from "../../activity/services/activity.service";
import { ActivityAction } from "../../activity/entities/activity.entity";
import { PaginatedResponseDto } from "../../../types/paginated-response.dto";

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

    async findAll(page: number, limit: number): Promise<PaginatedResponseDto<Vaccine>> {

        this.logger.info(`Fetching vaccines`);

        const [vaccines, total] = await this.repo.findAll(
            page,
            limit
        );

        return this.buildPaginatedResponse(
            vaccines,
            total,
            page,
            limit
        );
    }

    async findAllActive(): Promise<Vaccine[]> {
        return this.repo.findAllActive();
    }

    async findAllActivePaginated(page: number, limit: number): Promise<PaginatedResponseDto<Vaccine>> {

        this.logger.info(`Fetching active vaccines`);

        const [vaccines, total] = await this.repo.findAllActivePaginated(
            page,
            limit
        );

        return this.buildPaginatedResponse(
            vaccines,
            total,
            page,
            limit
        );
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
    async getStats() {
        this.logger.info(`Fetching vaccine stats`);

        return this.repo.getStats();
    }
    private buildPaginatedResponse(
        vaccines: Vaccine[],
        total: number,
        page: number,
        limit: number
    ): PaginatedResponseDto<Vaccine> {

        return {
            data: vaccines,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPreviousPage: page > 1,
            },
        };
    }

}