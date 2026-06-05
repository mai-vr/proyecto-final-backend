import { Router } from "express"
import { limiter } from "../middleware/requestLimiter"

const AuthRouter = Router()

AuthRouter.post('/auth', register)
AuthRouter.post('/auth', limiter, login)