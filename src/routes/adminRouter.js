import { Router } from 'express'
import { verifyRole } from '../middleware/verifyRole.js'
import { deleteArticles, getAllArticles } from '../controllers/adminControllers.js'

const AdminRouter = Router()
const ALLOWED_ROLE = ['admin']

AdminRouter.get('/all', getAllArticles)
AdminRouter.delete('/:id', deleteArticles)

export { AdminRouter }