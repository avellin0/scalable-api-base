import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({path: "src/infra/.env"});
const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5433,
});

db.connect()

export {db};
