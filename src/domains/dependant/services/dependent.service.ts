import { Service } from "typedi";
import { DependentRepository } from "../repositories/dependent.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { UserRepository } from "../../user/repositories/user.repository";
import { VaccineRepository } from "../../vaccine/repositories/vaccine.repository";
import { CreateDependentDto, DependentOutDto, UpdateDependentDto } from "../types/dependent.dto";
import { NotFoundException } from "../../../common/exceptions";
import { VaccinationRecordRepository } from "../../vaccination-record/repositories/vaccination-record.repository";
import { status } from "../../vaccination-record/entities/vaccination-record.entity";
import { ActivityService } from "../../activity/services/activity.service";
import { ActivityAction } from "../../activity/entities/activity.entity";
import { PaginatedResponseDto } from "../../../types/paginated-response.dto";
import { Dependent } from "../entities/dependent.entity";


@Service()
export class DependentService {

    constructor(
        private readonly repository: DependentRepository,
        private readonly vaccineRepository: VaccineRepository,
        private readonly vaccinationRecordRepository: VaccinationRecordRepository,
        private readonly userRepository: UserRepository,
        private readonly logger: LoggerService,
        private readonly activityService: ActivityService,
    ) { }

    public async create(guardianId: number, data: CreateDependentDto): Promise<DependentOutDto> {
        this.logger.info(`Creating dependent for guardian ${guardianId}`);

        const guardian = await this.userRepository.findById(guardianId);

        if (!guardian) {
            throw new NotFoundException("Guardian not found");
        }

        const dependent = await this.repository.create({
            ...data,
            guardian,
        });

        const vaccines = await this.vaccineRepository.findAllActive();

        const vaccinationRecords = vaccines.map((vaccine) => {
            const dueDate = new Date(data.dateOfBirth);

            dueDate.setDate(
                dueDate.getDate() + vaccine.recommendedAgeInDays
            );

            return {
                dependent,
                vaccine,
                dueDate,
                status: status.UPCOMING,
            };
        });

        await this.vaccinationRecordRepository.createMany(
            vaccinationRecords
        );

        await this.activityService.logActivity(
            ActivityAction.DEPENDENT_CREATED,
            guardianId,
            `Dependent ${dependent.fullName} created`,
            "dependent",
            String(dependent.id)
        );
        return dependent;
    }

    public async getAll(guardianId: number, page: number, limit: number): Promise<PaginatedResponseDto<DependentOutDto>> {
        this.logger.info(`Fetching dependents`);

        const [dependents, total] = await this.repository.findAllByGuardian(
            guardianId,
            page,
            limit
        );

        return this.buildPaginatedResponse(
            dependents,
            total,
            page,
            limit
        );
    }

    public async getById(dependentId: number, guardianId: number): Promise<DependentOutDto> {
        const dependent = await this.repository.findById(
            dependentId,
            guardianId
        );

        if (!dependent) {
            throw new NotFoundException("Dependent not found");
        }

        return dependent;
    }

    public async update(dependentId: number, guardianId: number, data: UpdateDependentDto): Promise<DependentOutDto> {

        const dependent = await this.repository.findById(
            dependentId,
            guardianId
        );

        if (!dependent) {
            throw new NotFoundException("Dependent not found");
        }
        this.logger.info(`Updating dependent ${dependent.id}`);

        await this.repository.update(dependentId, data);

        const updatedDependent = await this.repository.findById(
            dependentId,
            guardianId
        );
        await this.activityService.logActivity(
            ActivityAction.DEPENDENT_UPDATED,
            guardianId,
            `Dependent updated`,
            "dependent",
            String(dependent.id)
        );

        return updatedDependent as DependentOutDto;
    }

    public async delete(dependentId: number, guardianId: number): Promise<void> {
        const dependent = await this.repository.findById(
            dependentId,
            guardianId
        );

        if (!dependent) {
            throw new NotFoundException("Dependent not found");
        }
        this.logger.info(
            `Deleting dependent ${dependent.id}`
        );

        await this.activityService.logActivity(
            ActivityAction.DEPENDENT_DELETED,
            guardianId,
            `Dependent deleted`,
            "dependent",
            String(dependent.id)
        );

        await this.repository.softDelete(dependentId);
    }

    public async getStats(guardianId: number) {

        this.logger.info(`Fetching dependent stats`);

        return this.repository.getStats(guardianId);
    }

    private buildPaginatedResponse(dependents: Dependent[], total: number, page: number, limit: number): PaginatedResponseDto<DependentOutDto> {
        return {
            data: dependents.map((dependent) => ({
                id: dependent.id,
                fullName: dependent.fullName,
                dateOfBirth:
                    dependent.dateOfBirth,
                gender:
                    dependent.gender,
                relationship:
                    dependent.relationship,
                notes:
                    dependent.notes,
                isActive:
                    dependent.isActive,
                createdAt:
                    dependent.createdAt,
            })),

            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(total / limit),
                hasNextPage:
                    page < Math.ceil(total / limit),
                hasPreviousPage:
                    page > 1,
            },
        };
    }
}