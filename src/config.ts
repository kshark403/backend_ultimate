import * as dotenv from 'dotenv'

/**
 * default is .env
 */
dotenv.config()

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ultimate'
        // uri: process.env.MONGO_URI || 'mongodb://chao:chao@localhost:27017/ultimate'
    },
    secret: {
        accessToken: process.env.SECRET_ACCESS_TOKEN || 'root'
    }
}

export default config
