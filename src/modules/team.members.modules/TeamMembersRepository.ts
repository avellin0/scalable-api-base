import { BaseRepository } from "../../core/baseRepository/AbstractFactory"
import { TeamMembers, TeamMembersDTO} from "./team.members.interface"

export class TeamMembersRepository extends BaseRepository<TeamMembers, TeamMembersDTO>{}