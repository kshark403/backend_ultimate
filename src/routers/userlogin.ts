import { FastifyInstance } from 'fastify'
import userloginHandlers from '../handlers/userlogin'
import { verifyAccessToken } from '../hooks/auth'

const userloginRouters = async (app: FastifyInstance) => {
    const preHandler = [verifyAccessToken]

    /**
     * GET /userlogins
     */
    // app.post('/', { preHandler }, userloginHandlers.handlePostCreateNew)
    app.get('/', { preHandler }, userloginHandlers.handleGetUserlogins)
    app.get('/:id', { preHandler }, userloginHandlers.handleGetUserloginsById)
    app.patch('/:id', { preHandler }, userloginHandlers.handlePatchUpdateUserloginById)
    app.delete('/:id', { preHandler }, userloginHandlers.handleDeleteUserloginById)
}

export default userloginRouters
