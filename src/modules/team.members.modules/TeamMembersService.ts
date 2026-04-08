import { request } from "express";
import { TeamMembersRepository } from "./TeamMembersRepository";
import { HttpError } from "@/core/httpError/HttpError";

export class TeamMembersService {
    constructor(private readonly repository: TeamMembersRepository) {}

    async createTeamMembersService(userId: string, teamId: string) {
        if (!userId || !teamId) {
            throw HttpError.BadRequest({
                path: __filename,
                details: "All fields is required",
            });
        }

        const insertingTeamMembers = await this.repository.create({
            team_id: teamId,
            user_id: userId,
        });

        if (!insertingTeamMembers) {
            throw HttpError.BadRequest({
                path: __filename,
                details: "We can not insert these datas on database",
            });
        }

        return insertingTeamMembers;
    }

    async getTeamMemberById(id: string) {
        return await this.repository.find({ where: { user_id: id } });
    }
}

const { tenant_id } = request;
const teamMemberRepo = new TeamMembersRepository("team_members", tenant_id);
export const teamMemberService = new TeamMembersService(teamMemberRepo);
