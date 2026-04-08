import { NextFunction, Request, Response } from "express";
import { RefreshToken } from "./RefreshToken";
import { errorHandlers, HttpError } from "@/core/httpError/HttpError";

export async function RefreshMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const auth = req.headers.authorization as string;
        const token = auth.substring(7);

        const middleware = new RefreshToken();
        const refreshToken = await middleware.RefreshTokenOnDatabase(token);

        req.access_token = refreshToken.access;
        next();
    } catch (error: any) {
        if (error instanceof HttpError) {
            const handler = errorHandlers[error.code];
            return handler(error, res);
        }
    }
}
