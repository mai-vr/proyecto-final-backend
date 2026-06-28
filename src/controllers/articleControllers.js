import { Article } from '../models/articleModel.js'
import { articleSchema } from '../services/articleValidations.js'
import { existingArticleFields, verifyDataLength } from '../services/helpers.js'

const getArticles = async (req, res) => {
    try {
        const userLogged = req.userLogged // 'userLogged' is a req property made on the middleware. It contains the data from the user.
        const limit = Number(req.query.limit) || 1 // By default the limit is 10 elements.
        const page = Number(req.query.page) || 1
        const { category, userId, sort, order } = req.query // Filters
        const skip = (page - 1) * limit
        const filter = {}

        if (category) filter.category = category.toLowerCase()
        if (userLogged.role !== 'admin') {
            filter.userId = userLogged.id
        } else if (userId) {
            filter.userId = userId
        }
        let orderMongo = 1
        if (order) {
            orderMongo = order === 'asc' ? -1 : 1
        }

        const articles = await Article.find(filter).skip(skip).limit(limit).sort({ [sort]: orderMongo })

        res.status(200).json({
            success: true,
            data: articles,
            message: 'Articles gotten successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: 'Error trying to get the articles'
        })
    }
}

const getOneArticle = async (req, res) => {
    try {
        const id = req.params.id
        const foundArticle = await Article.findById(id, { userId: 0 })

        if (!foundArticle) {
            res.status(404).json({
                success: false,
                error: 'We could not found the article required'
            })
        }

        res.status(200).json({
            success: true,
            data: foundArticle,
            message: 'Article gotten successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        })
    }
}

const createArticle = async (req, res) => {
    try {
        const { body } = req
        const userLogged = req.userLogged
        const { title, subtitle, text, category } = body

        const newArticle = {
            title,
            subtitle,
            text,
            category,
            userId: userLogged.id
        }

        const validateArticle = articleSchema.safeParse(newArticle)
        if (!validateArticle.success) {
            return res.status(409).json({
                success: false,
                error: 'Some fields are incorrect'
            })
        }

        const saveArticle = await Article.create(newArticle)
        saveArticle.save()

        const { userId, ...publicData } = saveArticle.toObject()
        res.status(201).json({
            success: true,
            data: publicData,
            message: 'New article created successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: 'Could not create the article'
        })
    }
}

const updateArticle = async (req, res) => {
    try {
        const { body } = req
        const id = req.params.id
        const { title, subtitle, text, category } = body

        if (id.toString().length !== 24) {
            return res.status(400).json({
                success: false,
                error: 'Id is wrong'
            })
        }

        const validateUpdateData = articleSchema.partial().safeParse(body) // .partial() means that the user can update one or all the fields from the article.
        if (!validateUpdateData.success) {
            return res.status(400).json({
                success: false,
                error: 'New data is not valid'
            })
        }

        const updatedArticle = await Article.findByIdAndUpdate(id, { ...body }, { new: true, projection: { userId: 0 } })

        if (!updatedArticle) {
            return res.status(404).json({
                success: false,
                error: 'Could not find the article to update'
            })
        }

        // if (subtitle || text) {
        //     if (!verifyDataLength(subtitle) || !verifyDataLength(text)) {
        //         return res.status(400).json({
        //             success: false,
        //             error: 'Subtitle and text must includes at least 3 words'
        //         })
        //     }
        // }

        res.status(200).json({
            success: true,
            data: updatedArticle,
            message: 'Article updated successfully'
        })
    } catch (error) {
        console.log(error)
        res.json(400).json({
            success: false,
            error: 'Could not update the article'
        })
    }
}

const deleteArticle = async (req, res) => {
    try {
        const id = req.params.id
        const userData = req.userLogged

        let deletedArticle
        if (userData.role === 'admin') {
            deletedArticle = await Article.findByIdAndDelete(id)
        } else { // If the user is not admin the article must be written by them to delete it.
            deletedArticle = await Article.findOneAndDelete({ _id: id, userId: userData.id })
            if (!deletedArticle) {
                return res.status(404).json({
                    success: false,
                    error: 'Could not find the article to delete'
                })
            }
        }

        const deletedArticleData = deletedArticle.toObject()
        delete deletedArticleData.userId

        const publicData = { ...deletedArticle }
        res.status(200).json({
            success: true,
            data: deletedArticleData,
            message: 'Article deleted successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            error: 'Could not delete the article'
        })
    }
}

export { getArticles, getOneArticle, createArticle, updateArticle, deleteArticle }