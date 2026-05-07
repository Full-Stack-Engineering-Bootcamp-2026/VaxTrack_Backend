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

        const data = await this.service.getRecentActivities(
            req.user!.userId,
            req.user!.role
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async getAllActivities(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.getAllActivities(
            req.user!.userId,
            req.user!.role
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async getById(req: AuthRequest, res: Response): Promise<Response> {

        const data = await this.service.getById(Number(req.params.id));

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }
}