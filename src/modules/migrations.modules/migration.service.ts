import { HttpError } from "@/core/httpError/HttpError";
import { MigrateRepository } from "./migrations.repository";
import { request } from "express";

export class MigrateService{
    constructor(protected readonly repository: MigrateRepository){}

    async createMigration(version: string){
        if(!version) throw HttpError.BadRequest({path: __dirname + __filename, details: 'Version not valid'})
        return this.repository.create({version: version})
    }

    async getMigrationsList(){
        return (await this.repository.findAll()).rows
    }
}

const {tenant_id} = request
const migrateRepo = new MigrateRepository('migrations',tenant_id)
export const migrateService = new MigrateService(migrateRepo)