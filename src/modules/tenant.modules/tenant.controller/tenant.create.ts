import { Request, Response } from "express";
import { tenantService } from "../tenant.service";
import { HttpError } from "@/core/httpError/HttpError";

export class CreateTenant {
    async handle(req: Request, res: Response) {
        const { tenant_name } = req.body;
        if (!tenant_name) throw HttpError.BadRequest({path: __filename});

        tenantService.createTenant({ name: tenant_name });
    }
}

export const createTenant = new CreateTenant()
