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

        this.router.get(
            "/upcoming",
            authenticate,
            asyncHandler(this.controller.getUpcomingVaccines.bind(this.controller))
        );

        this.router.get(
            "/overdue",
            authenticate,
            asyncHandler(this.controller.getOverdueVaccines.bind(this.controller))
        );

        this.router.get(
            "/compliance",
            authenticate,
            asyncHandler(this.controller.getCompliance.bind(this.controller))
        );

        this.router.get(
            "/status-breakdown",
            authenticate,
            asyncHandler(this.controller.getStatusBreakdown.bind(this.controller))
        );
        this.router.get(
            "/",
            authenticate,
            asyncHandler(this.controller.getAll.bind(this.controller))
        );
        this.router.get(
            "/trend",
            authenticate,
            asyncHandler(this.controller.getChartTrend.bind(this.controller))
        );  
        this.router.patch(
            "/:id/status",
            authenticate,
            requireRole(
                UserRole.ADMIN,
                UserRole.STAFF
            ),
            asyncHandler(this.controller.updateStatus.bind(this.controller))
        );
        this.router.delete(
            "/:id",
            authenticate,
            requireRole(
                UserRole.ADMIN,
                UserRole.STAFF
            ),
            asyncHandler(this.controller.delete.bind(this.controller))
        );
    }


}