import { Service } from "typedi";
import { VaccineService } from "../services/vaccine.service";
import { Request, Response } from "express";
import { failure, success } from "../../../Http_Response/response";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";
import { generateResponse } from "../../../common/utils/response.util";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";

@Service()
export class VaccineController {
    constructor(private service: VaccineService) { }
    async create(req: AuthRequest, res: Response): Promise<Response> {
        const data = await this.service.create(req.user!.userId, req.body);
        return generateResponse(res, {
            statusCode: HttpStatus.CREATED,
            message: SuccessMessages.CREATED,
            data,
        });
    }

    async findAll(req: Request, res: Response) {
        const data = await this.service.findAll();
        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    async findAllActive(req: Request, res: Response) {
        const data = await this.service.findAllActive();
        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    async find(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id < 0)
            throw new BadRequestException("Invalid Id");
        const data = await this.service.find(id);
        if (!data)
            throw new NotFoundException("Vaccine not found");
        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    async update(req: AuthRequest, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id < 0)
            throw new BadRequestException("Invalid Id");
        const vaccine = await this.service.find(id);
        if (!vaccine)
            throw new NotFoundException("Vaccine Not found");

        const data = await this.service.update(id, req.user!.userId, req.body);
        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: SuccessMessages.UPDATED,
            data,
        });
    }

    async disable(req: AuthRequest, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id < 0)
            throw new BadRequestException("Invalid Id");
        await this.service.disable(id, req.user!.userId);
        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: "Vaccine disabled successfully",
        });
    }
    async getStats(req: Request, res: Response): Promise<Response> {

        const data = await this.service.getStats();

        return generateResponse(res, {
            statusCode:
                HttpStatus.OK,
            data,
        });
    }
}