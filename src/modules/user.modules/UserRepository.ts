import { BaseRepository } from "../../core/baseRepository/AbstractFactory";
import { UserProps, UserPropsDTO } from "./user.interface";

export class UserRepository extends BaseRepository<UserProps, UserPropsDTO> {
    async ValidateUserById(id: string) {        
        return await this.find({ where: { user_id: id } });
    }
}
