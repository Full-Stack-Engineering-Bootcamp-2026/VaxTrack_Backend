import { Service } from "typedi";
import { VaccinationRecordRepository } from "../repositories/vaccination-record.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { status } from "../entities/vaccination-record.entity";
import { RecordVaccinationDto, UpdateVaccinationDto, VaccinationRecordOutDto } from "../types/vaccination-record.dto";
import { NotFoundException } from "../../../common/exceptions";
import { number } from "joi";
import { UserRepository } from "../../user/repositories/user.repository";
import { ActivityService } from "../../activity/services/activity.service";
import { ActivityAction } from "../../activity/entities/activity.entity";

@Service()
export class VaccinationRecordService {
    constructor(
        private readonly repository: VaccinationRecordRepository,
        private readonly logger: LoggerService,
        private readonly userRepository: UserRepository,
        private readonly activityService: ActivityService,
    ) { }
    public async recordVaccination(vaccinationRecordId: number, staffId: number, data: RecordVaccinationDto): Promise<VaccinationRecordOutDto> {
        const record = await this.repository.findById(vaccinationRecordId);
        if (!record) {
            throw new NotFoundException("Vaccination record not found");
        }
        this.logger.info(`Recording vaccination`);

        await this.repository.update(vaccinationRecordId, {
            administeredDate:
                data.administeredDate,

            batchNumber:
                data.batchNumber,

            clinicalNotes:
                data.clinicalNotes,

            administeredBy: {
                id: staffId,
            } as any,

            status:
                status.COMPLETED,
        }
        );
        const updatedRecord = await this.repository.findById(vaccinationRecordId);
        await this.activityService.logActivity(
            ActivityAction.VACCINATION_RECORDED,
            staffId,
            `Vaccination recorded`,
            "vaccination_record",
            String(record.id)
        );
        return updatedRecord as VaccinationRecordOutDto;
    }
    public async update(
        vaccinationRecordId: number,
        staffId: number,
        data: UpdateVaccinationDto
    ): Promise<VaccinationRecordOutDto> {

        const record = await this.repository.findById(vaccinationRecordId);
        if (!record) {
            throw new NotFoundException("Vaccination record not found");
        }
        this.logger.info(`Updating vaccination record ${vaccinationRecordId}`);
        await this.repository.update(vaccinationRecordId, data);
        const updatedRecord = await this.repository.findById(vaccinationRecordId);
        await this.activityService.logActivity(
            ActivityAction.VACCINATION_UPDATED,
            staffId,
            `Vaccination updated`,
            "vaccination_record",
            String(vaccinationRecordId)
        );
        return updatedRecord as VaccinationRecordOutDto;
    }

    public async getTimeline(dependentId: number): Promise<VaccinationRecordOutDto[]> {
        return this.repository.findTimelineByDependent(dependentId);
    }

    public async markOverdueVaccines(staffId: number): Promise<void> {
        this.logger.info(`Marking vaccination overdue`);
        const overdueVaccines =
            await this.repository.findOverDueVaccines();
        for (const vaccine of overdueVaccines) {
            await this.repository.update(vaccine.id, { status: status.OVERDUE });
            await this.activityService.logActivity(
                ActivityAction.OVERDUE_MARKED,
                staffId,
                `Vaccination marked overdue`,
                "vaccination_record",
                String(vaccine.id)  
            );
        }
    }

    public async getCompliance(guardianId?: number) {
        const completed = await this.repository.countCompleted(guardianId);
        const upcoming = await this.repository.countUpcoming(guardianId);
        const overdue = await this.repository.countOverdue(guardianId);
        const total = completed + upcoming + overdue;

        let compliancePercentage = 0;
        if (total > 0) {
            compliancePercentage = Math.round((completed / total) * 100);
        }
        return { compliancePercentage };
    }

    public async getStatusBreakdown(guardianId?: number) {
        const completed = await this.repository.countCompleted(guardianId);
        const upcoming = await this.repository.countUpcoming(guardianId);
        const overdue = await this.repository.countOverdue(guardianId);
        return { completed, upcoming, overdue };
    }

    public async getUpcomingVaccines(guardianId?: number) {
        return this.repository.findUpcomingVaccines(guardianId);
    }

    public async getOverdueVaccines(guardianId?: number) {
        return this.repository.findOverdueVaccines(guardianId);
    }
}