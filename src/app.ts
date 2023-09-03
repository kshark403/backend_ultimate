import fastify, { FastifyServerOptions } from 'fastify'
import fastifyCors from  'fastify-cors'

import authRouters  from './routers/auth'
import userRouters  from './routers/user'
import articleRouters  from './routers/article' 
import { CustomError } from './utils/custom-error'
import userloginRouters from './routers/userlogin'

declare module 'fastify' {
    interface FastifyRequest {
        userId?: string
    }
}

const buildApp = (options: FastifyServerOptions) => {
    const app =  fastify(options)

    app.register(fastifyCors)
    app.get('/',async () => 'OK')
    app.register(authRouters, { prefix: '/auth' })
    app.register(userRouters, { prefix: '/users' })
    app.register(userloginRouters, { prefix: '/userlogins' })
    app.register(articleRouters, { prefix: '/articles' })

    app.setErrorHandler((error, request, reply) => {
        const customError: CustomError = error
        // console.log('error => ', error);
        
        reply
            .status(customError.statusCode || 500)
            .send({
                error: {
                    message: customError.message,
                    code: customError.code,
                    data: customError.data
                }
            })

    })

    return app
}

export default buildApp

