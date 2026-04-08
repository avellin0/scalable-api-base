import { TokenBody } from "../CreateToken/CreateToken";
import { HttpError } from "@/core/httpError/HttpError";
import jwt from "jsonwebtoken";
import { ITenant } from "@/modules/tenant.modules/tenant.interface";
import { tenantService } from "@/modules/tenant.modules/tenant.service";

export class TokenService {
    static extractAccessToken(auth: string): string {
        if (!auth || !auth.startsWith("Bearer")) {
            throw HttpError.BadRequest({
                details: "You need to provide a Bearer token in the header",
                path: __filename,
            });
        }

        return auth.substring(7);
    }
    
    static validateAccessToken(auth: string): TokenBody {
        const verifiedToken = this.VerifyUserToken(auth) as TokenBody;

        const expireDate = Number(verifiedToken.expireIn);

        if (expireDate < Date.now()) {
            throw HttpError.Unauthorized({
                path: "@infra/services/TokenService.ts",
                details: 'Token already expired'
            });
        }

        return verifiedToken;
    }
    static VerifyUserToken(token: string): TokenBody {
        try {
            const decoded = jwt.verify(
                token,
                process.env.MY_SECRET_KEY as string,
            );

            if (!decoded) {
                throw HttpError.Validation({
                    details: "Token Invalid",
                    path: __filename + "/verifyUserToken",
                });
            }

            return decoded as TokenBody;
        } catch (err) {
            console.log(err);
            throw HttpError.Validation({
                details: "Token Invalid",
                path: __filename + "/verifyUserToken",
            });
        }
    }

    static verifyTenantToken(token: string): ITenant {
            const decoded = jwt.verify(
                token,
                process.env.MY_SECRET_KEY as string,
            );

            if (!decoded) {
                throw HttpError.Validation({
                    details: "Token Invalid",
                    path: __filename + "/verifyTenantToken",
                });
            }

            return decoded as ITenant;
    }

    static async verifyIfExistsOnDB(token: string) {
        const tenant = this.verifyTenantToken(token)

        const existsTokenOnDB = await tenantService.verifyIfExists({
            name: tenant.name,
        });

      return existsTokenOnDB
    }
}

