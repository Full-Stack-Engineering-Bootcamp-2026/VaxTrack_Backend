import { Router } from "express";
import { Service } from "typedi";
import { UserController } from "../controllers/user.controller";
import { validate } from "../../../common/middleware/validate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";
import { changePasswordSchema, createStaffSchema, forgotPasswordSchema, loginUserSchema, registerUserSchema, resetPasswordSchema, updateProfileSchema } from "../validator/user.validator";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { UserRole } from "../entities/user.entity";

@Service()
export class UserRoutes {
    public router: Router;

    constructor(private readonly controller: UserController) {
        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {
        this.router.post(
            "/register",
            validate(registerUserSchema),
            asyncHandler(this.controller.register.bind(this.controller))
        );

        this.router.post(
            "/login",
            validate(loginUserSchema),
            asyncHandler(this.controller.login.bind(this.controller))
        );

        this.router.post(
            "/forgot-password",
            validate(forgotPasswordSchema),
            asyncHandler(this.controller.forgotPassword.bind(this.controller))
        );

        this.router.post(
            "/reset-password",
            validate(resetPasswordSchema),
            asyncHandler(this.controller.resetPassword.bind(this.controller))
        );

        this.router.get(
            "/profile",
            authenticate,
            asyncHandler(this.controller.getProfile.bind(this.controller))
        );

        this.router.put(
            "/profile",
            authenticate,
            validate(updateProfileSchema),
            asyncHandler(this.controller.updateProfile.bind(this.controller))
        );

        this.router.put(
            "/change-password",
            authenticate,
            validate(changePasswordSchema),
            asyncHandler(this.controller.changePassword.bind(this.controller))
        );

        this.router.post(
            "/staff",

            authenticate,

            requireRole(UserRole.ADMIN),

            validate(createStaffSchema),

            asyncHandler(
                this.controller.createStaff.bind(
                    this.controller
                )
            )
        );

    }
}