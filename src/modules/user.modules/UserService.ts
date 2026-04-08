import { UserRepository } from "./UserRepository";
import {HttpError} from "../../core/httpError/HttpError"


export class UserService{

    constructor(private readonly repository: UserRepository){}

    async ValidateUserById(id: string) {
        
        if(!id) throw HttpError.NotFound({path: __filename, details: 'ID not found'})

        const query = await this.repository.ValidateUserById(id)
   
        if (!query.rows[0] || query.rows.length === 0) {
            HttpError.BadRequest({path: 'UserService.ts', details: 'Not have rows in query'})
        }

        return query.rows[0];
    }
}
