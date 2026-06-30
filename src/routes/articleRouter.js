import { Router } from 'express'
import { getArticles, getOneArticle, createArticle, updateArticle, deleteArticle } from '../controllers/articleControllers.js'
import { verifyRole } from '../middleware/verifyRole.js'

const ArticleRouter = Router()

ArticleRouter.get('/all', verifyRole(['admin']), getArticles) // Only admins can access to this route.
ArticleRouter.get('/', getArticles)
ArticleRouter.get('/:id', getOneArticle)
ArticleRouter.post('/', createArticle)
ArticleRouter.put('/:id', updateArticle)
ArticleRouter.delete('/:id', deleteArticle)

export { ArticleRouter }