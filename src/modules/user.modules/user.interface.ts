export interface UserProps{
    user_id: string,
    name: string,
    email: string,
    password_hash: string,
    active: Boolean,
    created_at: Date,
    refresh_token: string | null
}

export interface UserPropsDTO{
    name: string,
    email: string,
    password: string,
}