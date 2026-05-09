import { Service } from "typedi";
import { DependentService } from "../services/dependent.service";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { generateResponse } from "../../../common/utils/response.util";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { Response } from "express";

@Service()
export class DependentController {
    constructor(
        private readonly service: DependentService
    ) { }

    public async create(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.create(
            req.user!.userId,
            req.body
        );

        return generateResponse(res, {
            statusCode: HttpStatus.CREATED,
            message: SuccessMessages.CREATED,
            data,
        });
    }

    public async getAll(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.getAll(
            req.user!.userId
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async getById(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.getById(
            Number(req.params.id),
            req.user!.userId
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async update(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.update(
            Number(req.params.id),
            req.user!.userId,
            req.body
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: SuccessMessages.UPDATED,
            data,
        });
    }

    public async delete(req: AuthRequest, res: Response): Promise<Response> {

        await this.service.delete(
            Number(req.params.id),
            req.user!.userId
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: SuccessMessages.DELETED,
        });
    }

    public async getStats(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.getStats(req.user!.userId);

        return generateResponse(res, {
            statusCode:
                HttpStatus.OK,
            data,
        });
    }
}