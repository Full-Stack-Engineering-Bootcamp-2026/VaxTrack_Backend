import { Response } from "express";
import { Service } from "typedi";


import { AuthRequest } from "../../../common/interfaces/auth-request.interface";

import { generateResponse } from "../../../common/utils/response.util";

import { HttpStatus } from "../../../common/constants/http-status.constants";
import { ActivityService } from "../services/activity.service";

@Service()
export class ActivityController {

    constructor(
        private readonly service: ActivityService
    ) { }

    public async getRecentActivities(req: AuthRequest, res: Response): Promise<Response> {

        const page = Number(req.query.page) || 1;

        const limit = Math.min(Number(req.query.limit) || 10, 100);

        const data = await this.service.getRecentActivities(
            page,
            limit,
            req.user!.userId,
            req.user!.role
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async getAllActivities(req: AuthRequest, res: Response): Promise<Response> {

        const page = Number(req.query.page) || 1;

        const limit = Math.min(Number(req.query.limit) || 10, 100);

        const data = await this.service.getAllActivities(
            page,
            limit,
            req.user!.userId,
            req.user!.role
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async getById(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.getById(Number(req.params.id), req.user!.userId, req.user!.role);
        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }
}