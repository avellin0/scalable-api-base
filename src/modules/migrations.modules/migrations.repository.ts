import { BaseRepository } from "@/core/baseRepository/AbstractFactory";
import { migrationInterface, migrationInterfaceDTO} from "./migration.interface";

export class MigrateRepository extends BaseRepository<migrationInterface, migrationInterfaceDTO>{}