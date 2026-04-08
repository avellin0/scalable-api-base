import { Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export class RateLimitingFactory {
    private ip: string;

    constructor(ip: string) {
        this.ip = ip;
    }

    static LimiterForLoginByIp() {
        return rateLimit({
            windowMs: 1 * 30 * 1000, // 30 seconds
            limit: 2,
            keyGenerator: (req) => {
                if (req.user?.id) {
                    console.log("Rate limiting by user");
                    return `user-${req.user.id}`;
                }

                console.log("RateLimiting by IP");
                
                return ipKeyGenerator(req.ip!);
            },

            message: "Too many requests from this IP, please try again later.",
        });
    }
}
