import { HttpError } from "@/core/httpError/HttpError";
import { TenantRepository } from "./tenant.repository";

export class TenantService {
    constructor(private readonly repository: TenantRepository) {}

    async createTenant(params: { name: string }) {
        const nameAlreadyExists =
            (await this.repository.find({ where: { name: params.name } }))
                .rows;

        console.log(nameAlreadyExists);
        if (nameAlreadyExists.length) {
            throw HttpError.Conflict({
                details: "Client name already exists, please choice another",
            });
        }

        return this.repository.create({ name: params.name });
    }

    async verifyIfExists(params: { name: string }) {
        return this.repository.find({ where: { name: params.name } });
    }
}

const tenantRepo = new TenantRepository("tenants");
export const tenantService = new TenantService(tenantRepo);
