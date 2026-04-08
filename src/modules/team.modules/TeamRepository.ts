import { team, teamDTO } from "./team.interface";
import { BaseRepository } from "../../core/baseRepository/AbstractFactory";

export class TeamRepository extends BaseRepository<team,teamDTO> {
    async getTeamByName(name: string) {
        return await this.findMany({where: {name: name}});
    }
}
