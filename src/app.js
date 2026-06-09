import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { authMiddleware } from './middleware/authMiddleware.js'
import { AuthRouter } from './routes/authRouter.js'
import { ArticleRouter } from './routes/articleRouter.js'
import { connectDB } from './config/mongoDBConnection.js'

try {
    process.loadEnvFile() // Reads the env variables on .env file (used for dev).
} catch (error) {
    config()
}

const server = express()
server.use(express.json()) // Post request can be read in json.
server.use(cors())
server.use(express.static('public'))

const environment = 'dev'
let port
if (environment === 'dev') {
    port = process.env.PORT
}

server.use('/auth', AuthRouter)
server.use('/articles', authMiddleware, ArticleRouter)

server.listen(port, () => {
    connectDB()
    console.log(`Server: http://localhost:${port}`)
})