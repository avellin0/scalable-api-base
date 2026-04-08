import { errorHandlers, HttpError } from "@/core/httpError/HttpError";
import { TokenService } from "@/infra/services/TokenService";
import { NextFunction, Request, Response } from "express";
import z from "zod";

export async function TenancyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const auth = req.headers["tenancy-id"] as string;
        const verifiedToken = TokenService.verifyTenantToken(auth);

        const schema = z.object({
            id: z.uuidv4(),
        });

        const validateUserId = schema.safeParse({
            id: verifiedToken.tenant_id,
        });

        if (!validateUserId.success) {
            throw HttpError.Unauthorized({
                path: __filename,
                details: "uuid not authorized",
            });
        }

        const existsTokenOnDB = await TokenService.verifyIfExistsOnDB(
            auth,
        );

        if (!existsTokenOnDB.rows) {
            throw HttpError.NotFound({
                path: __filename,
                details: "Tenant_id not found",
            });
        }        

        req.tenant_id = verifiedToken.tenant_id;
        return next();
        
    } catch (error: any) {
        if (error instanceof HttpError) {
            const handler = errorHandlers[error.code];
            return handler(error, res);
        }
    }
}
