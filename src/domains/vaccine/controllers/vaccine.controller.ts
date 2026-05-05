import { Service } from "typedi";
import { VaccineService } from "../services/vaccine.service";
import { Request, Response } from "express";
import { failure, success } from "../../../Http_Response/response";
import { BadRequestException, NotFoundException } from "../../../common/exceptions";

@Service()
export class VaccineController {
    constructor(private service: VaccineService) { }
    async create(req: Request, res: Response): Promise<Response> {
        const data = await this.service.create(req.body);
        return res.json(success(data, "Vaccine added"));
    }

    async findAll(req: Request, res: Response) {
        const data = await this.service.findAll();
        return res.json(success(data, "Vaccines Fetched"));
    }

    async find(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id < 0)
            throw new BadRequestException("Invalid Id");
        const data = await this.service.find(id);
        if (!data)
            throw new NotFoundException("Vaccine not found");
        return res.json(success(data, "Vaccine fetched"));
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id < 0)
            throw new BadRequestException("Invalid Id");
        const data = await this.service.update(id, req.body);
        return res.json(success(data, "Vaccine updated"));
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (Number.isNaN(id) || id < 0)
            throw new BadRequestException("Invalid Id");
        await this.service.delete(id);
        return res.json(success(null, "Vaccine deleted"));
    }
}