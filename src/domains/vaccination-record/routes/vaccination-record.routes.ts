import { Router } from "express";
import { Service } from "typedi";
import { VaccinationRecordController } from "../controllers/vaccination-record.controller";
import { authenticate } from "../../../common/middleware/authenticate.middleware";
import { requireRole } from "../../../common/middleware/authorize.middleware";
import { UserRole } from "../../user/entities/user.entity";
import { recordVaccinationSchema, updateVaccinationSchema } from "../validator/vaccination-record.validator";
import { validate } from "../../../common/middleware/validate.middleware";
import { asyncHandler } from "../../../common/utils/async-handler";

@Service()
export class VaccinationRecordRoutes {
    public router: Router;

    constructor(
        private readonly controller:
            VaccinationRecordController
    ) {

        this.router = Router();
        this.addRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    private addRoutes(): void {

        this.router.put("/:id/record",
            authenticate,
            requireRole(UserRole.STAFF, UserRole.ADMIN),
            validate(recordVaccinationSchema),
            asyncHandler(this.controller.recordVaccination.bind(this.controller))
        );
        this.router.patch(
            "/mark-overdue",
            authenticate,
            requireRole(
                UserRole.STAFF,
                UserRole.ADMIN
            ),
            asyncHandler(this.controller.markOverdue.bind(this.controller))
        );
        this.router.get(
            "/dependent/:dependentId",
            authenticate,
            asyncHandler(this.controller.getTimeline.bind(this.controller))
        );

        this.router.put(
            "/:id",
            authenticate,
            requireRole(UserRole.STAFF, UserRole.ADMIN),
            validate(updateVaccinationSchema),
            asyncHandler(this.controller.update.bind(this.controller))
        );




    }


}