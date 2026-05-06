import { Request, Response } from "express";
import { Service } from "typedi";
import { UserService } from "../services/user.service";
import { UserCreateDto } from "../types/user.dto";
import { HttpStatus } from "../../../common/constants/http-status.constants";
import { SuccessMessages } from "../../../common/constants/success-messages.constants";
import { generateResponse } from "../../../common/utils/response.util";

@Service()
export class UserController {
    constructor(private readonly service: UserService) { }

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

    public async forgotPassword(req:Request,res:Response):Promise<Response>{
        await this.service.forgotPassword(req.body);

        return generateResponse(res,{
            statusCode:HttpStatus.OK,
            message:`Reset Password email sent to ${req.body.email}`
        })
    }
}