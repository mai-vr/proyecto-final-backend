import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { authMiddleware } from './middleware/authMiddleware'
import { AuthRouter } from './routes/authRouter'
import { ArticleRouter } from './routes/articleRouter'
import { connectDB } from './config/mongoDBConnection'

config()
process.loadEnvFile() // Reads the env variables on .env file.

const server = express()
server.use(express.json()) // Post request can be read in json.
server.use(cors())

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