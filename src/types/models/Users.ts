export interface UsersSchema {
    username: string
    password: string
    email: string
    name?: string
    surname?: string
    role: string
    cid?: number
    img_profile?: string
    status?: number
}