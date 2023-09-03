import { CustomErrorParams } from '../utils/custom-error'

export const UserSomethingWentWrong: CustomErrorParams = {
    message: 'Something went wrong',
    code: 'ART000',
    statusCode: 400
}

export const UserIdInvalid: CustomErrorParams = {
    message: 'Object ID invalid',
    code: 'ART001',
    statusCode: 400
}

export const UserCannotUpdate: CustomErrorParams = {
    message: 'User cannot update',
    code: 'ART002',
    statusCode: 400
}

export default {
    UserSomethingWentWrong,
    UserIdInvalid,
    UserCannotUpdate
}
