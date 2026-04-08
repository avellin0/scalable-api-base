import { DatabaseType } from "../../InMemoryDb";

declare global {
    namespace Express {
        interface Request {
            user: {
                id?: string | any;
                email?: string | any;
            }
            access_token: string | any;
            refresh_token: string | any;
            tenant_id: string | any
        }
    }
}