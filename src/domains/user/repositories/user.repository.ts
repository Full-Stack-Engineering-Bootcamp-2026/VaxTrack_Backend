import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { User, UserRole } from "../entities/user.entity";
import { UpdateProfileDto, UserCreateDto } from "../types/user.dto";

@Service()
export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }

    async createUser(data: Partial<User>): Promise<User> {

        const user = this.repository.create(data);

        return this.repository.save(user);
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.repository.findOne({ where: { resetToken: token } })
    }

    async updateResetToken(id: number, token: string, expiry: Date): Promise<void> {
        await this.repository.update(id, {
            resetToken: token,
            resetTokenExpiry: expiry,
        });
    }

    async updatePassword(id: number, password: string): Promise<void> {
        await this.repository.update(id, {
            password,
            resetToken: "",
            resetTokenExpiry: null as unknown as Date,
            isEmailVerified: true
        });
    }

    async findById(id: number): Promise<User | null> {
        return this.repository.findOne({
            where: {
                id,
                isActive: true,
            },
        });
    }

    async updateProfile(id: number, data: UpdateProfileDto): Promise<User | null> {

        await this.repository.update(id, {
            ...data,
        });

        return this.findById(id);
    }

    async updateUser(id: number, data: Partial<User>): Promise<User | null> {

        await this.repository.update(id, data);

        return this.findById(id);
    }

    async findAllUsers(page: number, limit: number): Promise<[User[], number]> {
        return this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: "DESC",
            },
        });
    }

    async findAllStaff(page: number, limit: number): Promise<[User[], number]> {

        return this.repository.findAndCount({
            where: {
                role: UserRole.STAFF,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: "DESC",
            },
        });
    }

    async findAllGuardians(page: number, limit: number): Promise<[User[], number]> {

        return this.repository.findAndCount({
            where: {
                role: UserRole.GUARDIAN,
            },
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: "DESC",
            },
        });
    }
}