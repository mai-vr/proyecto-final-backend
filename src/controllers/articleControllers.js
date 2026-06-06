import { Article } from '../models/articleModel.js'

const getArticles = async (req, res) => {
    try {
        const userLogged = req.userLogged // 'userLogged' is a req property made on the middleware. It contains the data from the user.

        const filteredArticles = await Article.find({ userId: userLogged.id }, { userId: 0 }) // Mongo projection, we don´t have to show the id of the user.
        res.status(200).json({
            success: true,
            data: filteredArticles,
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

        const newArticle = await Article.create({
            title: body.title,
            subtitle: body.subtitle,
            text: body.text,
            userId: userLogged.id
        })
        newArticle.save()

        const { userId, ...publicData } = newArticle.toObject()
        res.status(201).json({
            success: true,
            data: publicData,
            message: 'New article created successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: 'Could not create the product'
        })
    }
}

const updateArticle = async (req, res) => {
    try {
        const { body } = req
        const id = req.params.id

        const updatedArticle = await Article.findByIdAndUpdate(id, { ...body }, { new: true, projection: { userId: 0 } })

        if (!updatedArticle) {
            res.status(404).json({
                success: false,
                error: 'Could not find the article to update'
            })
        }

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

        const deletedArticle = await Article.findByIdAndDelete(id)
        if (!deletedArticle) {
            res.status(404).json({
                success: false,
                error: 'Could not find the article to delete'
            })
        }

        const deletedArticleData = deletedArticle.toObject()
        delete deletedArticleData.userId

        const publicData = { ...deletedArticle }
        res.status(200).json({
            success: true,
            data: publicData,
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