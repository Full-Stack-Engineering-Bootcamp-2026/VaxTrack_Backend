import { Service } from "typedi";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../db/db";
import { User, UserRole } from "../entities/user.entity";
import { UserCreateDto } from "../types/user.dto";

@Service()
export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }

    async create(data: UserCreateDto): Promise<User> {
        const user = this.repository.create({
            ...data,
            role: UserRole.GUARDIAN,
            isActive: true,
        });
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
            resetToken: '',
            resetTokenExpiry: '',
        });
    }
}