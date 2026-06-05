import { Router } from "express"
import { limiter } from "../middleware/requestLimiter.js"
import { register, login } from "../controllers/authControllers.js"

const AuthRouter = Router()

AuthRouter.post('/auth', register)
AuthRouter.post('/auth', limiter, login)