import { BaseRepository } from "@/core/baseRepository/AbstractFactory";
import { ITenant, ITenantDTO } from "./tenant.interface";

export class TenantRepository extends BaseRepository<ITenant, ITenantDTO>{}