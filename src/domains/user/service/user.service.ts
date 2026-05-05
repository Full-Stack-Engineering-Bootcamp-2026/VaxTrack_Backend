import { Service } from "typedi";
import { UserRepository } from "../repository/user.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { LoginResponseDto, UserCreateDto, UserLoginDto, UserOutDto } from "../types/user.dto";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../../common/exceptions";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
    public async login(data: UserLoginDto): Promise<LoginResponseDto> {
        this.logger.info(`Logging in user : ${data.email}`);
        const user = await this.repository.findByEmail(data.email);
        if (!user)
            throw new NotFoundException("User not found");
        const match = await bcrypt.compare(data.password, user.password);
        if (!match)
            throw new UnauthorizedException("Invalid password");
        const token = jwt.sign({
            userId: user.id,
            email: user.email
        },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        )
        return { token };
    }
}