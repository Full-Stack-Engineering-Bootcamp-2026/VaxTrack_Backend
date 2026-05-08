import { Request, Response } from "express";
import { Service } from "typedi";
import { UserService } from "../services/user.service";
import { UserCreateDto } from "../types/user.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { generateResponse } from "../../../common/utils/response.util";
import { AuthRequest } from "../../../common/interfaces/auth-request.interface";
import { B2Service } from "../../../common/utils/b2.service";
import { BadRequestException } from "../../../common/exceptions";

@Service()
export class UserController {
    constructor(private readonly service: UserService, private readonly b2Service: B2Service) { }

    public async register(req: Request, res: Response): Promise<Response> {
        const data = await this.service.register(req.body as UserCreateDto);

        return generateResponse(res, {
            statusCode: HttpStatus.CREATED,
            message: SuccessMessages.CREATED,
            data,
        });
    }

    public async login(req: Request, res: Response) {
        const data = await this.service.login(req.body);
        generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: SuccessMessages.LOGIN,
            data,
        });
    }

    public async forgotPassword(req: Request, res: Response): Promise<Response> {
        await this.service.forgotPassword(req.body);

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: `Reset Password email sent to ${req.body.email}`
        })
    }

    public async resetPassword(req: Request, res: Response): Promise<Response> {
        await this.service.resetPassword(req.body);

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: "Password reset successful",
        });
    }

    public async getProfile(req: AuthRequest, res: Response): Promise<Response> {
        const data = await this.service.getProfile(
            req.user!.userId
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async updateProfile(req: AuthRequest, res: Response): Promise<Response> {
        const data = await this.service.updateProfile(
            req.user!.userId,
            req.body
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: SuccessMessages.UPDATED,
            data,
        });
    }

    public async changePassword(req: AuthRequest, res: Response): Promise<Response> {
        await this.service.changePassword(
            req.user!.userId,
            req.body
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: "Password changed successfully",
        });
    }

    public async createStaff(req: AuthRequest, res: Response): Promise<Response> {

        await this.service.createStaff(req.user!.userId, req.body);

        return generateResponse(res, {
            statusCode: HttpStatus.CREATED,
            message: "Staff user created successfully",
        });
    }

    public async logout(req: AuthRequest, res: Response): Promise<Response> {

        await this.service.logout(req.user!.userId);

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: "Logged out successfully",
        });
    }

    public async uploadProfileTemp(req: AuthRequest, res: Response): Promise<Response> {

        if (!req.file) {
            throw new BadRequestException(
                "Image file is required"
            );
        }

        const data = await this.b2Service
            .uploadTempProfileImage(
                req.file
            );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            data,
        });
    }

    public async deleteTempFile(req: AuthRequest, res: Response): Promise<Response> {

        await this.b2Service.deleteFile(
            req.body.fileName
        );

        return generateResponse(res, {
            statusCode: HttpStatus.OK,
            message: "Temp file deleted",
        });
    }
}