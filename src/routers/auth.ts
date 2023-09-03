import { FastifyInstance } from 'fastify'
import { handleLogin, handleLogin2, handleRegister, handleRefreshToken } from '../handlers/auth'
import { verifyAccessToken } from '../hooks/auth'

const authRouters = async (app: FastifyInstance) => {
    app.post('/login', handleLogin2)
    app.post('/register', handleRegister)
    app.post('/refresh-token', {
        preHandler: [
            verifyAccessToken
        ]
    }, handleRefreshToken)
}

export default authRouters