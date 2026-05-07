import { Router } from "express";
import { Service } from "typedi";
import { VaccineController } from "../controllers/vaccine.controller";
import { validate } from "../../../common/middleware/validate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";
import { vaccineSchema, vaccineUpdateSchema } from "../validator/vaccine.validator";

@Service()
export class VaccineRoutes {
    public router: Router;

    constructor(private readonly controller: VaccineController) {
        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {
        this.router.post(
            "/",
            validate(vaccineSchema),
            asyncHandler(this.controller.create.bind(this.controller))
        );

        this.router.get(
            "/",
            asyncHandler(this.controller.findAll.bind(this.controller))
        );

        this.router.get(
            "/active",
            asyncHandler(this.controller.findAllActive.bind(this.controller))
        )

        this.router.get(
            "/:id",
            asyncHandler(this.controller.find.bind(this.controller))
        );

        this.router.put(
            "/:id",
            validate(vaccineUpdateSchema),
            asyncHandler(this.controller.update.bind(this.controller))
        );

        this.router.patch(
            "/:id",
            asyncHandler(this.controller.disable.bind(this.controller))
        );
    }
}