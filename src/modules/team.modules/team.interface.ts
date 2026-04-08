export interface team {
    team_id: string;
    name: string;
    lead_id: string;
    created_at: Date;
}

export interface teamDTO {
    teamName: string;
    leaderId: string;
}
