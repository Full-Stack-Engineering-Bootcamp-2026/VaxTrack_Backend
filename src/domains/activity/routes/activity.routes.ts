import { Router } from "express";
import { Service } from "typedi";

import { ActivityController } from "../controllers/activity.controller";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";

@Service()
export class ActivityRoutes {

    public router: Router;

    constructor(
        private readonly controller: ActivityController
    ) {
        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {

        this.router.get(
            "/recent",
            authenticate,
            asyncHandler(
                this.controller.getRecentActivities.bind(this.controller)
            )
        );

        this.router.get(
            "/",
            authenticate,
            asyncHandler(
                this.controller.getAllActivities.bind(this.controller)
            )
        );

        this.router.get(
            "/:id",
            authenticate,
            asyncHandler(
                this.controller.getById.bind(this.controller)
            )
        );
    }
}