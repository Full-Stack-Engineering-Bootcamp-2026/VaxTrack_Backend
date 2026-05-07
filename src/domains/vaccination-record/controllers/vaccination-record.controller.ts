import { Service } from "typedi";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { VaccinationRecordService } from "../services/vaccination-record.service";
import { Response } from "express";
import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class VaccinationRecordController {
    constructor(
        private readonly service: VaccinationRecordService
    ) { }

    public async recordVaccination(
        req: AuthRequest,
        res: Response
    ): Promise<Response> {
        const recordId = Number(req.params.id);

        if (isNaN(recordId) || recordId <= 0) {
            return generateResponse(res, {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid vaccination record ID provided.",
            });
        }

        const data = await this.service.recordVaccination(recordId, req.user!.userId, req.body);

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: "Vaccination recorded successfully",
            data,
        });
    }

    public async update(
        req: AuthRequest,
        res: Response
    ): Promise<Response> {
        const recordId = Number(req.params.id);

        if (isNaN(recordId) || recordId <= 0) {
            return generateResponse(res, {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid vaccination record ID provided.",
            });
        }

        const data = await this.service.update(recordId, req.body);

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: SuccessMessages.UPDATED,
            data,
        });
    }

    public async getTimeline(
        req: AuthRequest,
        res: Response
    ): Promise<Response> {
        const dependentId = Number(req.params.dependentId);
        if (isNaN(dependentId) || dependentId <= 0) {
            return generateResponse(res, {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid dependent ID. It must be a valid number.",
            });
        }

        const data = await this.service.getTimeline(dependentId);

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async markOverdue(
        req: AuthRequest,
        res: Response
    ): Promise<Response> {
        await this.service.markOverdueVaccines();

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: "Overdue vaccines updated successfully",
        });
    }
}