import { FastifyRequest } from "fastify";
import Users from "../models/Users";
// import Users from "../models/Users";
import { UsersSchemaWithDocument } from "../models/Users/schema";
// import { UserloginRequestBody, UserloginParams, UserloginWithRequestBodyAndParams } from '../types/handlers/userlogin'
import { UsersSchema } from "../types/models/Users";

// export const handlePostCreateNew = async (request:any): Promise<UsersSchemaWithDocument> => {
//     const { userId } = request
//     const { username,
//         password,
//         email,
//         name,
//         surname,
//         role} = request.body

//     const userlogin = await Users.createNewUser({
//         username,
//         password,
//         email,
//         name,
//         surname,
//         role
//     })

//     return userlogin
// }

export const handleGetUserlogins = async (request: FastifyRequest): Promise<UsersSchema[]> => Users.getUserLogins()

export const handleGetUserloginsById = async (request: any): Promise<UsersSchema[]> => {
    const { id } = request.params

    const userlogins = await Users.getUserloginsById(id)

    return userlogins
}

export const handlePatchUpdateUserloginById = async (request: any): Promise<string> => {
    const { userId } = request
    const { id } = request.params
    const { username,
        password,
        email,
        name,
        surname,
        role,
        cid
    } = request.body

    await Users.updateUserLoginById(id, {
        username,
        password,
        email,
        name,
        surname,
        role,
        cid
    })

    return 'OK'
}


export const handleDeleteUserloginById = async (request: any): Promise<string> => {
    const { id } = request.params

    await Users.deleteUserLoginById(id)

    return 'OK'
}

export default {
    handleGetUserlogins,
    handleGetUserloginsById,
    // handlePostCreateNew,
    handlePatchUpdateUserloginById,
    handleDeleteUserloginById
}