import { CreateToken, TokenBody } from "../../CreateToken/CreateToken";

import { UserRepository } from "@/modules/user.modules/UserRepository";
import { HttpError } from "@/core/httpError/HttpError";
import { UserProps } from "@/modules/user.modules/user.interface";
import { TokenService } from "@/infra/services/TokenService";
import {hash} from "bcrypt"

export class RefreshToken {
    private IsValidateAccessToken(token: string): TokenBody {
        const validate = TokenService.validateAccessToken(token);
        return validate;
    }

    async RefreshTokenOnDatabase(token: string) {
        const { user_id }: TokenBody = this.IsValidateAccessToken(
            token,
        );

        const query = new UserRepository("users");

        const validatedQuery = await query.ValidateUserById(user_id);

        if (!validatedQuery) throw HttpError.NotFound();

        const user: UserProps = validatedQuery.rows[0];
        const createToken = new CreateToken(user.name, user.user_id);

        const RefreshToken = createToken.CreateRefreshToken();
        const AccessToken = createToken.CreateAccessToken();

        const refresh_hash = await hash(RefreshToken, 8)        

        query.update({
            data: { refresh_token: refresh_hash },
            where: { user_id: user_id },
        });

        return { refresh: RefreshToken, access: AccessToken };
    }
}
