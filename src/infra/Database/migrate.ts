import fs from "fs";
import { db } from "./Connect";
import { migrateService } from "@/modules/migrations.modules/migration.service";
import { migrationInterface } from "@/modules/migrations.modules/migration.interface";

interface IfilesToExecute {
    version: string;
    path: string;
}

export async function SortMigrations() {
    const fileInDir = `${__dirname}/migrations`;

    const sortedSchemasFromFolder = fs.readdirSync(fileInDir).sort();

    const versions: migrationInterface[] = await migrateService
        .getMigrationsList();

    const versionsOnDatabase: any[] = [];

    for (let v in versions) {
        versionsOnDatabase.push(versions[v].version);
    }

    let schemaList: string[] = [];

    for (let v in sortedSchemasFromFolder) {
        schemaList.push(sortedSchemasFromFolder[v].slice(0, 3));
    }

    let needToBeExecuted: IfilesToExecute[] = [];

    sortedSchemasFromFolder.map(async (value, _) => {
        const version = value.slice(0, 3);
        if (!versionsOnDatabase.includes(version)) {
            needToBeExecuted.push({ version: version, path: value });
        }
    });

    versionsOnDatabase.map((value, _) => {
        if (!schemaList.includes(value)) {
            needToBeExecuted.push({ version: value, path: "" });
        }
    });

    return needToBeExecuted;
}

export async function migrate() {
    await db.query("SELECT pg_advisory_lock(12345)");

    const filesToExecute: IfilesToExecute[] = await SortMigrations();
    try {
        console.log("Pressione: [ctl + C] quando terminar");

        for (const file of filesToExecute) {
            if (file.path === "") {
                return console.log('Migrations Concluidas | Version ahead -> ', file.version)
            }

            const schemaPath = file.path;
            const filePath = `src/infra/Database/migrations/${schemaPath}`;

            const schema = fs.readFileSync(filePath, "utf-8");

            try {
                console.log("Runing migrations", file.version);
                await db.query("BEGIN");
                await db.query(schema);
                await db.query(
                    "INSERT INTO migrations(version) VALUES($1)",
                    [file.version],
                );
                await db.query("COMMIT");
            } catch (error) {
                await db.query("ROLLBACK");
                throw error;
            }
        }

        console.log("Migrations Concluidas...");
    } catch (err) {
        console.error(err);
    } finally {
        await db.query("SELECT pg_advisory_unlock(12345)");
    }
}

migrate();
