import { Service } from "typedi";
import { UserRepository } from "../repositories/user.repository";
import { LoginResponseDto, UserLoginDto } from "../types/user.dto";
import { NotFoundException, UnauthorizedException } from "../../../common/exceptions";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

@Service()
export class UserService {
    constructor(private repository: UserRepository) { }

    public async login(data: UserLoginDto): Promise<LoginResponseDto> {
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