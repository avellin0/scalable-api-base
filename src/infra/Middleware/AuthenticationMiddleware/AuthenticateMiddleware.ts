import { NextFunction, Request, Response } from "express";
import { TokenService } from "../../services/TokenService";
import { UserRepository } from "../../../modules/user.modules/UserRepository";
import { errorHandlers, HttpError } from "@/core/httpError/HttpError";

export async function Authenticate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const auth = req.headers.authorization as string;

    try {
        if (!auth) {
            req.user = { email: null };
            return next();
        }

        const extractedToken = TokenService.extractAccessToken(auth);
        const validatedToken = TokenService.validateAccessToken(extractedToken);

        const user = new UserRepository("users", req.tenant_id);
        const validatedUserId = await user.ValidateUserById(
            validatedToken.user_id,
        );

        if (!validatedUserId.rows[0] || validatedUserId.rows.length === 0) {
            throw HttpError.Validation({
                path: __filename,
                details: "User not valid",
            });
        }

        req.user = { id: validatedUserId.rows[0].user_id };

        return next();
    } catch (error: any) {
        if (error instanceof HttpError) {
            const handler = errorHandlers[error.code];
            return handler(error, res);
        }
    }
}
