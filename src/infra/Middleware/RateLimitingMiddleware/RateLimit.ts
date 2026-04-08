import { NextFunction, Request, Response } from "express";
import { TokenService} from "../../services/TokenService";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export function CreateReqMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const auth = req.headers.authorization as string;

    if (!auth) {
      req.user = { email: null };
      return next();
    }

    TokenService.VerifyUserToken(auth);    

    return next();
  } catch (error: any) {
    if (error.message === "IP address is required for rate limiting") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Ocorreu algum erro em nossos servidores" });
  }
}

export const limitingRequestsByHour = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  handler: (_, res) => {
    res.status(429).json({
      error: "You are being rate limited, try again later",
    });
  },

  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      console.log("Using user ID for rate limiting:", req.user.id);
      return ipKeyGenerator(req.user.id as string);
    }

    console.log("No user found, using IP address for rate limiting");
    return ipKeyGenerator(req.ip!);
  },
  statusCode: 429,
});
