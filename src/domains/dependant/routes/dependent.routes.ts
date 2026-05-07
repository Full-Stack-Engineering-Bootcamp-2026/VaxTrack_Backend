import { Router } from "express";
import { Service } from "typedi";
import { DependentController } from "../controllers/dependent.controller";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { UserRole } from "../../user/entities/user.entity";
import { asyncHandler } from "../../../common/utils/async-handler";
import { validate } from "../../../common/middleware/validate.middleware";
import {
    createDependentSchema,
    updateDependentSchema,
} from "../validator/dependent.validator";


@Service()
export class DependentRoutes {
    public router: Router;

    constructor(
        private readonly controller: DependentController
    ) {
        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {

        this.router.post(
            "/",
            validate(createDependentSchema),
            asyncHandler(this.controller.create.bind(this.controller))
        );

        this.router.get(
            "/",
            asyncHandler(this.controller.getAll.bind(this.controller))
        );

        this.router.get(
            "/:id",
            asyncHandler(this.controller.getById.bind(this.controller))
        );

        this.router.put(
            "/:id",
            validate(updateDependentSchema),
            asyncHandler(this.controller.update.bind(this.controller))
        );

        this.router.delete(
            "/:id",
            asyncHandler(this.controller.delete.bind(this.controller))
        );
    }
}