import { Request, request } from "express";
import { teamDTO } from "./team.interface";
import { TeamRepository } from "./TeamRepository";
import { HttpError } from "@/core/httpError/HttpError";

class TeamServiceFactory {
    constructor(private readonly repository: TeamRepository) {}

    async createTeamService({ teamName, leaderId }: teamDTO) {
        if (!teamName || !leaderId) {
            throw HttpError.BadRequest({
                path: __filename,
                details: "Name and leaderId are required",
            });
        }

        const veryfiedUser = await this.repository.find({
            where: { lead_id: leaderId },
        });

        if (!veryfiedUser.rows[0] || veryfiedUser.rows.length === 0) {
            throw HttpError.NotFound({
                path: __filename,
                details: "User not found",
            });
        }

        const team = await this.repository.create({ teamName, leaderId });

        if (!team) {
            throw HttpError.BadRequest({
                path: __filename,
                details: "Error creating team, please try again later",
            });
        }
    }

    async validateExitsTeam(name: string) {
        const existsTeam = await this.repository.findMany({
            where: { name: name },
        });

        if (existsTeam) {
            throw HttpError.Conflict({
                path: __filename,
                details: "Team already exists",
            });
        }
    }

    async DeleteByLeaderId(id: string) {
        this.repository.delete({ where: { lead_id: id } });
    }
}

const { tenant_id } = request;
const repository = new TeamRepository("team", tenant_id);
export const TeamService = new TeamServiceFactory(repository);
