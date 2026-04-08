import { Request, Response } from "express";
import { TeamService } from "../TeamService";
import { errorHandlers, HttpError } from "@/core/httpError/HttpError";

class TeamCreate {
    async handle(req: Request, res: Response) {
        try {
            const { team_name } = req.body;

            if (!team_name) {
                throw new Error(
                    "All fields is required, provide all fields: team_name and leaderId",
                    { cause: "INVALID FIELDS" },
                );
            }

            TeamService.createTeamService({
                teamName: team_name,
                leaderId: req.user.id,
            });

            res.status(201).json({ message: "Team created successfully" });
            
        } catch (error: any) {
            if (error instanceof HttpError) {
                const handler = errorHandlers[error.code];
                return handler(error, res);
            }
        }
    }
}

export const teamCreate = new TeamCreate();
