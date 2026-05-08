import { Service } from "typedi";
import { UserRepository } from "../repositories/user.repository";
import { LoggerService } from "../../../common/utils/logger.service";
import { ChangePasswordDto, CreateStaffDto, ForgotPasswordDto, LoginResponseDto, ResetPasswordDto, UpdateProfileDto, UserCreateDto, UserLoginDto, UserOutDto } from "../types/user.dto";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../../common/exceptions";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { EmailService } from "../../../common/utils/email-service";
import crypto from "crypto";
import { User, UserRole } from "../entities/user.entity";

@Service()
export class UserService {
    constructor(
        private readonly repository: UserRepository,
        private readonly logger: LoggerService,
        private readonly emailService: EmailService

    ) { }

    public async register(data: UserCreateDto): Promise<void> {
        this.logger.info(`Registering user : ${data.email}`);

        const existing = await this.repository.findByEmail(data.email);

        if (existing) {
            throw new BadRequestException(`User already exists with this email..`);
        }


        const user = await this.repository.createUser({
            fullName: data.fullName,

            email: data.email,

            phone: data.phone,

            role: UserRole.GUARDIAN,

            password: "",

            isEmailVerified: false,

            isActive: true,
        });

        await this.setupPasswordFlow(user);

    }
    public async login(data: UserLoginDto): Promise<LoginResponseDto> {
        this.logger.info(`Logging in user : ${data.email}`);
        const user = await this.repository.findByEmail(data.email);
        if (!user)
            throw new NotFoundException("User not found");

        if (!user.isEmailVerified) {
            throw new UnauthorizedException(
                "Please verify your email and setup your password"
            );
        }

        if (!user.password) {
            throw new UnauthorizedException(
                "Please setup your password first"
            );
        }

        const match = await bcrypt.compare(data.password, user.password);
        if (!match)
            throw new UnauthorizedException("Invalid password");
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        )
        return {
            accessToken: token,
            tokenType: "Bearer",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                imageUrl: user.imageUrl,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            }
        };
    }

    private generateResetToken() {

        const token = crypto.randomBytes(32).toString("hex");

        const expiry = new Date(Date.now() + 1000 * 60 * 15);

        return {
            token,
            expiry,
        };
    }

    public async forgotPassword(data: ForgotPasswordDto): Promise<void> {
        const user = await this.repository.findByEmail(data.email);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const { token, expiry } = this.generateResetToken()

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

    public async getProfile(userId: number): Promise<UserOutDto> {

        const user = await this.repository.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    public async updateProfile(userId: number, data: UpdateProfileDto): Promise<UserOutDto> {

        const user = await this.repository.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const updatedUser = await this.repository.updateProfile(
            userId,
            data
        );

        return updatedUser as UserOutDto;
    }

    public async changePassword(userId: number, data: ChangePasswordDto): Promise<void> {

        const user = await this.repository.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isMatch = await bcrypt.compare(
            data.currentPassword,
            user.password
        );

        if (!isMatch) {
            throw new UnauthorizedException(
                "Current password is incorrect"
            );
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        await this.repository.updatePassword(userId, hashedPassword);
    }

    private async setupPasswordFlow(user: User): Promise<void> {

        const { token, expiry, } = this.generateResetToken();

        await this.repository.updateResetToken(
            user.id,
            token,
            expiry
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.emailService.sendPasswordSetupEmail(
            user.email,
            resetLink,
            user.role
        );
    }

    public async createStaff(data: CreateStaffDto): Promise<void> {

        const existing = await this.repository.findByEmail(
            data.email
        );

        if (existing) {
            throw new ConflictException(
                "User already exists"
            );
        }

        const user = await this.repository.createUser({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            role: UserRole.STAFF,
            password: "",
            isEmailVerified: false,
            isActive: true,
        });

        await this.setupPasswordFlow(user);
    }
}