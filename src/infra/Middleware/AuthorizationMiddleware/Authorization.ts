import { HttpError } from "@/core/httpError/HttpError";
import {teamMemberService } from "@/modules/team.members.modules/TeamMembersService";

type rowsColumn = {
    user_id: string,
    team_id: string,
    role: string
}

export class AuthoMiddleware{
    static async VerifyRoleOnDatabase(id: string): Promise<void>{
        const user = await teamMemberService.getTeamMemberById(id)
        const columns: rowsColumn = user.rows[0]

        if (!user || user.rows.length === 0) {
            throw HttpError.NotFound({path: __filename, details: 'User not found on team members'})
        }

        if (!["admin", "support"].includes(columns.role)) {
            throw HttpError.Validation({path: __filename, details: 'Not authorized to access this content'})
        }
    }   
}
