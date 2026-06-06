import { Router } from 'express'
import { getArticles, getOneArticle, createArticle, updateArticle, deleteArticle } from '../controllers/articleControllers.js'

const ArticleRouter = Router()

ArticleRouter.get('/', getArticles)
ArticleRouter.get('/:id', getOneArticle)
ArticleRouter.post('/', createArticle)
ArticleRouter.put('/:id', updateArticle)
ArticleRouter.delete('/:id', deleteArticle)

export { ArticleRouter }