import { FastifyRequest } from "fastify/fastify"

export type AuthLoginBodyRequest = FastifyRequest<{
    Body: {
        username: string
        password: string
    }
}>

export type AuthRegisterBodyRequest = FastifyRequest<{
    Body: {
        username: string
        password: string
        email: string
        name: string
        surname: string
        role: string
        cid: number
        img_profile: string
        status: number
    }
}>

export interface AuthLoginBodyResponse {
    id: string
    username: string
    email: string
    name: string
    surname: string
    role: string
    cid: number
    img_profile: string
    status: number
    accessToken?: string
}

export interface AuthLoginBodyResponse2 {
    code: number
    status: string
    message: string
    data?: {
        id: string
        username: string
        email: string
        name: string
        surname: string
        role: string
        cid: number
        img_profile: string
        status: number
        accessToken?: string
    }
}

export interface AuthRefreshTokenResponse {
    accessToken: string
}