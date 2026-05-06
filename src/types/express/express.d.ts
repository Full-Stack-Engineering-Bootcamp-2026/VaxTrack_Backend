import { UserRole } from "../../domains/user/entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: UserRole;
      };
    }
  }
}