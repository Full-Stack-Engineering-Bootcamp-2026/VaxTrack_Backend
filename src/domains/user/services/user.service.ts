import { Service } from "typedi";
import { UserRepository } from "../repositories/user.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { ForgotPasswordDto, LoginResponseDto, ResetPasswordDto, UserCreateDto, UserLoginDto, UserOutDto } from "../types/user.dto";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../../common/exceptions";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { EmailService } from "../../../common/utils/email-service";
import crypto from "crypto";

@Service()
export class UserService {
    constructor(
        private readonly repository: UserRepository,
        private readonly logger: LoggerService,
        private readonly emailService: EmailService

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

    public async forgotPassword(data: ForgotPasswordDto): Promise<void> {
        const user = await this.repository.findByEmail(data.email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const token = crypto.randomBytes(32).toString("hex");

        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await this.repository.updateResetToken(user.id, token, expiry);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

        await this.emailService.sendResetPasswordEmail(user.email, resetLink)
    }

    public async resetPassword(data: ResetPasswordDto): Promise<void> {
        const user = await this.repository.findByResetToken(data.token);

        if (!user) {
            throw new NotFoundException("User with this token not found");
        }

        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new BadRequestException("Token expired");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await this.repository.updatePassword(user.id, hashedPassword)

        await this.emailService.sendPasswordChangedEmail(user.email);
    }
}