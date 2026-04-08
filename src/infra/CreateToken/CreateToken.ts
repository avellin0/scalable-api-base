import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ITenant } from "@/modules/tenant.modules/tenant.interface";
import { HttpError } from "@/core/httpError/HttpError";
dotenv.config({ path: "src/infra/.env" });

export type TokenBody = {
    user_id: string;
    user: string;
    expireIn: number;
};

class CreateToken {
    private user?: string;
    private user_id?: string;

    constructor(
        private username: string,
        private id: string,
    ) {
        this.user = username;
        this.user_id = id;

        if (!username || !id) {
            throw HttpError.BadRequest({ path: __filename });
        }
    }

    private GeneratePayload(): {
        RefreshToken: TokenBody;
        AccessToken: TokenBody;
    } {
        if (typeof (this.user) !== "string") {
            throw HttpError.BadRequest({ path: __filename });
        }

        const RefreshToken: TokenBody = {
            user: this.user,
            user_id: this.id,
            expireIn: Date.now() + (60 * 60 * 24 * 1000 * 7), // 7 days,
        };

        const AccessToken: TokenBody = {
            user: this.user,
            user_id: this.id,
            expireIn: Date.now() + (60 * 60 * 1000), // 1 Hours
        };

        return { RefreshToken, AccessToken };
    }

    CreateRefreshToken(): string {
        const payload = this.GeneratePayload();

        return jwt.sign(
            payload.RefreshToken,
            process.env.MY_SECRET_KEY as string,
        );
    }

    CreateAccessToken(): string {
        const payload = this.GeneratePayload();

        return jwt.sign(
            payload.AccessToken,
            process.env.MY_SECRET_KEY as string,
        );
    }
}

class CreateTenantToken {
    private Tenantparams?: {
        tenant_id: string | any;
        tenant_name: string | any;
    };

    constructor(
        private readonly params?: { tenant_id: string; tenant_name: string },
    ) {
        this.Tenantparams = params;
    }

    private generateTenantToken() {
        const TenantToken: Partial<ITenant> = {
            name: this.params?.tenant_name,
            tenant_id: this.params?.tenant_id,
        };

        return TenantToken;
    }

    CreateTenantToken() {
        const payload = this.generateTenantToken();
        console.log(payload);

        return jwt.sign(
            payload,
            process.env.MY_SECRET_KEY as string,
        );
    }
}

export { CreateTenantToken, CreateToken };
