import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import { authMiddleware } from './middleware/authMiddleware.js'
import { AuthRouter } from './routes/authRouter.js'
import { ArticleRouter } from './routes/articleRouter.js'
import { connectDB } from './config/mongoDBConnection.js'
import { routeErrorHandler } from './middleware/routeErrorHandler.js'
import { errorHandler } from './middleware/errorHandler.js'
import { verifyRole } from './middleware/verifyRole.js'

config()

const server = express()
server.use(express.json()) // Post request can be read in json.
server.use(cors())

const environment = 'dev'
let port
if (environment === 'dev') {
    port = process.env.PORT
}

const ADMIN_ROLE = 'admin'
const ALLOWED_ROLES = ['user', 'admin']

server.use('/api/auth', AuthRouter)
server.use('/api/articles', authMiddleware, verifyRole(ALLOWED_ROLES), ArticleRouter)
server.use(routeErrorHandler) // If the route doesn´t exist it shows a message in JSON.
server.use(errorHandler) // Every error will be shown as JSON in a specific format.

server.listen(port, () => {
    connectDB()
    console.log(`Server: http://localhost:${port}`)
})