import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { UsersSchema } from '../../types/models/Users'
import { AuthLoginBodyResponse, AuthLoginBodyResponse2 } from '../../types/handlers/auth'
import Users, { UsersSchemaWithDocument } from './schema'
import customError from '../../utils/custom-error'
import authErrors from '../../errors/auth'
import userErrors from '../../errors/user'
import config from '../../config'

const generateHashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)

    return hashPassword
}

const comparePassword = (password: string, existsPassword: string) : boolean => {
    const isPasswordCorrect = bcrypt.compareSync(password, existsPassword)
    if( !isPasswordCorrect ) {
        // throw Error('Password incorrect')
        customError(authErrors.AuthInvalidPassword)
    }
    return true
} 

const comparePassword2 = (password: string, existsPassword: string) : boolean => {
    const isPasswordCorrect = bcrypt.compareSync(password, existsPassword)
    if( !isPasswordCorrect ) {
        // throw Error('Password incorrect')
        // customError(authErrors.AuthInvalidPassword)
        return false
    }
    return true
} 

const generateAccessToken = (userId: string): string => {
    const token = jwt.sign({}, config.secret.accessToken, {
        expiresIn: 60*60,
        audience: String(userId)
    })
    
    return token
}

const mapUserResponseObject = (userId: string, user: UsersSchemaWithDocument, accessToken?: string): AuthLoginBodyResponse => {
    const response: AuthLoginBodyResponse = {
        id: userId,
        username: user.username,
        name: user.name || '',
        surname: user.surname || '',
        email: user.email,
        role: user.role,
        cid: user.cid || 0,
        img_profile: user.img_profile|| '',
        status: user.status || 0,
        accessToken
    }

    return response
}

export const createNewUser = async (doc: UsersSchema): Promise<UsersSchemaWithDocument> => {
    doc.password = generateHashPassword(doc.password)
    const user = new Users(doc)

    return user.save()
}

export const updateUserLoginById = async (userId: string, doc: UsersSchema): Promise<boolean> => {
    try {
        doc.password = generateHashPassword(doc.password)

        const result = await Users
            .updateOne({
                _id: userId,
                status: {
                    $ne: 'deleted'
                }
            }, {
                $set: {
                    ...doc
                }
            })

        if( result.modifiedCount == 0 ) {
            customError(userErrors.UserCannotUpdate)
        }

        return true
    } catch (error:any) {
        if(error.kind === 'ObjectId') {
            customError(userErrors.UserIdInvalid)
        } else if( error.name === 'CustomError' ) {
            error
        }
        customError(userErrors.UserSomethingWentWrong)

        return false
    }
}

export const userLogin = async (username: string, password: string): Promise<AuthLoginBodyResponse> => {
    const user = await Users.findOne({
        username
    })

    if(!user) {
        // throw new Error('username not found')
        // customError(authErrors.AuthInvalidUsername)
        customError({
            ...authErrors.AuthInvalidUsername,
            data: {
                testModeAgain: true
            },
            // data2: {
            //     testModeAgain: true
            // }
        })
    }
    comparePassword(password, user!.password)

    const userId = user!._id
    
    const accessToken = generateAccessToken(userId)

    const response: AuthLoginBodyResponse = mapUserResponseObject(userId, user!, accessToken)

    return response
}

export const userLogin2 = async (username: string, password: string): Promise<AuthLoginBodyResponse2> => {
    const user = await Users.findOne({
        username
    })

    if(!user) {
        // throw new Error('username not found')
        // customError(authErrors.AuthInvalidUsername)
        // customError({
        //     ...authErrors.AuthInvalidUsername,
        //     data: {
        //         testModeAgain: true
        //     },
        //     // data2: {
        //     //     testModeAgain: true
        //     // }
        // })

        return {
            code: 400,
            status: "fail",
            message: "Login fail, username is wrong",
        }
    }

    if( ! comparePassword2(password, user!.password) ) {
        return {
            code: 400,
            status: "fail",
            message: "Login fail, password is wrong",
        }
    }

    const userId = user!._id
    
    const accessToken = generateAccessToken(userId)

    const response: AuthLoginBodyResponse = mapUserResponseObject(userId, user!, accessToken)

    // return response
    return {
        code: 200,
        status: "success",
        message: "Login success",
        data: response
    }
}

export const getUserLogins = async (condition: object = {}): Promise<UsersSchema[]> => {
    const users = await Users
        .find({
            ...condition,
            status: 'active'
        })
        .sort({
            createAt: -1
        })
        .lean<UsersSchema[]>()

    return users
}

export const getUserloginsById = async (userId: string): Promise<UsersSchema[]> => {
    const users = await Users
        .find({
            _id: userId,
            status: 'active'
        })
        .sort({
            createAt: -1
        })
        .lean<UsersSchema[]>()

    return users
}

export const getUserById = async (userId: string): Promise<AuthLoginBodyResponse> => {
    const user = await Users.findById(userId)

    const response: AuthLoginBodyResponse = mapUserResponseObject(userId, user!)

    return response
}

export const deleteUserLoginById = async (userId: string): Promise<boolean> => {
    try {
        await Users.findByIdAndDelete(userId)
        return true
    } catch (error) {
        customError(userErrors.UserSomethingWentWrong)
        return false
    }
}

export default {
    createNewUser,
    updateUserLoginById,
    userLogin,
    userLogin2,
    getUserById,
    getUserLogins,
    getUserloginsById,
    generateAccessToken,
    deleteUserLoginById
}