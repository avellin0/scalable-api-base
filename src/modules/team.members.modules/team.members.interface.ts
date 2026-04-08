export interface TeamMembers{
    user_id: string,
    team_id: string,
    role: string | 'member'
}

export interface TeamMembersDTO{
    user_id: string,
    team_id: string,
    role?: string | 'member'
}