import express from "express";
import { ServerProtocol } from "./Adapter-Server-Protocol";
import { route } from "../routes/routes";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { limitingRequestsByHour } from "@/infra/Middleware/RateLimitingMiddleware/RateLimit";
import { TenancyMiddleware } from "@/infra/Middleware/Multi_Tenancy_Middleware/Tenancy.middleware";
import { Authenticate } from "@/infra/Middleware/AuthenticationMiddleware/AuthenticateMiddleware";

export class AdapterServer implements ServerProtocol {
    isRunning() {
        try {
            const app = express();

            app.use(cors());
            app.use("/api", TenancyMiddleware);
            app.use(Authenticate);
            app.use(limitingRequestsByHour);
            app.use(express.json());
            app.use(bodyParser.json());
            app.use(cookieParser());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(route);

            app.listen(3000, () => {
                console.log("Server is running on port 3000...");
            });
        } catch (error) {
            console.error("Failed to start server:", error);
        }
    }
}
