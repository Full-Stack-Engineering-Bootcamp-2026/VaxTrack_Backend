import { Service } from "typedi";
import { UserRepository } from "../repository/user.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { UserCreateDto, UserOutDto } from "../types/user.dto";
import { BadRequestException } from "../../../common/exceptions";
import bcrypt from 'bcrypt'

@Service()
export class UserService {
    constructor(
        private readonly repository: UserRepository,
        private readonly logger: LoggerService
    ) { }

    public async register(data: UserCreateDto): Promise<UserOutDto> {
        this.logger.info(`Registering user : ${data.email}`);

        const existing = await this.repository.findByEmail(data.email);

        if (existing) {
            throw new BadRequestException(`User already exists with this email..`);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user: UserOutDto = await this.repository.create({
            ...data,
            password: hashedPassword
        })

        return user;
    }
}