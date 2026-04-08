import express from "express";
import { CreateReqMiddleware, limitingRequestsByHour } from "@/infra/Middleware/RateLimitingMiddleware/RateLimit";

const gateway = express();

gateway.use(express.json());

gateway.get("/rate/login", CreateReqMiddleware, limitingRequestsByHour, (req, res) => {
    try {
        res.status(200).json({
            sucess: "You are not rate limited, you can login",
        });
    } catch (error: any) {
        if (error.message === "You are being rate limited, try again later") {
            res.status(429).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({
                error: "Erro no servidor, desculpe pelo transtorno",
            });
        }
    }
});

gateway.get("/rate/users", CreateReqMiddleware, limitingRequestsByHour, (req, res) => {
    try {
        res.status(200).json({
            sucess: "You are not rate limited, you can access users",
        });
    } catch (error: any) {
        if (error.message === "You are being rate limited, try again later") {
            res.status(429).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({
                error: "Erro no servidor, desculpe pelo transtorno",
            });
        }
    }
});

gateway.get("/rate/sign_up", CreateReqMiddleware, limitingRequestsByHour, (req, res) => {
    try {
        res.status(200).json({
            sucess: "You are not rate limited, you can sign up",
        });
    } catch (error: any) {
        if (error.message === "You are being rate limited, try again later") {
            res.status(429).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({
                error: "Erro no servidor, desculpe pelo transtorno",
            });
        }
    }
});


gateway.listen(3001, () => {
    console.log("Gateway is running on port 3001");
});