export interface migrationInterface{
    version: string,
    executed_at: Date
}

export interface migrationInterfaceDTO{
    version: string
}