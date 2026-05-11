import { Router } from "express";
import { Service } from "typedi";
import { UserController } from "../controllers/user.controller";
import { validate } from "../../../common/middleware/validate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";
import { changePasswordSchema, createStaffSchema, forgotPasswordSchema, loginUserSchema, registerUserSchema, resetPasswordSchema, updateProfileSchema } from "../validator/user.validator";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { UserRole } from "../entities/user.entity";
import { upload } from "../../../common/middleware/upload.middleware";

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

        this.router.post(
            "/logout",
            authenticate,
            asyncHandler(this.controller.logout.bind(this.controller))
        );

        this.router.post(
            "/profile-temp",
            authenticate,
            upload.single("image"),
            asyncHandler(this.controller.uploadProfileTemp.bind(this.controller))
        );

        this.router.delete(
            "/profile-temp",
            authenticate,
            asyncHandler(this.controller.deleteTempFile.bind(this.controller))
        );

        this.router.get(
            "/",
            authenticate,
            requireRole(UserRole.ADMIN),
            asyncHandler(this.controller.getAllUsers.bind(this.controller))
        );

        this.router.get(
            "/staff",
            authenticate,
            requireRole(UserRole.ADMIN),
            asyncHandler(this.controller.getAllStaff.bind(this.controller))
        );

        this.router.get(
            "/guardians",
            authenticate,
            requireRole(UserRole.ADMIN),
            asyncHandler(this.controller.getAllGuardians.bind(this.controller))
        );
        this.router.patch(
            "/staff/:id/deactivate",
            authenticate,
            requireRole(UserRole.ADMIN),
            asyncHandler(this.controller.deleteStaff.bind(this.controller))
        );
        this.router.patch(
            "/staff/:id/activate",
            authenticate,
            requireRole(UserRole.ADMIN),
            asyncHandler(this.controller.activateStaff.bind(this.controller))
        )

    }
}