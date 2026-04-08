import { errorHandlers, HttpError } from "@/core/httpError/HttpError";
import { AuthoMiddleware } from "./Authorization";
import { NextFunction, Request, Response } from "express";
import z from "zod";

export async function Authorization(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        if (!req.user.id) {
            throw HttpError.Unauthorized({
                path: __filename,
                details: "User not authenticated",
            });
        }

        const schema = z.object({
            id: z.uuidv4(),
        });

        const validateUserId = schema.safeParse({ id: req.user.id });

        if (!validateUserId.success) {
            throw HttpError.Unauthorized({
                path: __filename,
                details: "uuid not authorized",
            });
        }

        await AuthoMiddleware.VerifyRoleOnDatabase(validateUserId.data.id);

        return next();
    } catch (error: any) {
        if (error instanceof HttpError) {
            const handler = errorHandlers[error.code];
            return handler(error, res);
        }
    }
}
