import { Article } from '../models/articleModel.js'

const getAllArticles = async (req, res) => {
    const limit = Number(req.query.limit) || 1 // By default the limit is 10 elements.
    const page = Number(req.query.page) || 1
    const { category, userId } = req.query // Filters
    const sortBy = req.query.sort
    const order = req.query.order
    const skip = (page - 1) * limit

    const ALLOWED_ORDERS = ['asc', 'desc']
    const ALLOWED_ORDERBY = ['title', 'subtitle', 'createdAt', 'updatedAt']

    let filteredArticles = await Article.find()
    // Filter by conditions.
    if (category || userId) {
        if (category) {
            filteredArticles = await Article.find({ 'category': category.toLowerCase() }).skip(skip)
        }
        if (userId) {
            filteredArticles = await Article.find({ 'userId': userId }).skip(skip)
        }
        if (category && userId) {
            filteredArticles = await Article.find({ 'userId': userId, 'category': category }).skip(skip)
        }
        return res.status(200).json({
            success: true,
            data: filteredArticles,
            message: 'Articles filtered by author gotten successfully'
        })
    }

    // Organization of data.
    if (order || sortBy) {
        if (!ALLOWED_ORDERS.includes(order) || !ALLOWED_ORDERBY.includes(sortBy)) {
            return res.status(404).json({
                success: false,
                error: 'Order to sort or sort param is not allowed'
            })
        } else if (order.toLowerCase().trim() === 'asc') {
            filteredArticles = await Article.find().sort({ [sortBy]: 1 }).limit(limit).skip(skip)
            return res.status(200).json({
                success: true,
                data: filteredArticles,
                message: `Articles order by ${sortBy}`
            })
        } else if (order.toLowerCase().trim() === 'desc') {
            filteredArticles = await Article.find().sort({ [sortBy]: -1 }).limit(limit).skip(skip)
            return res.status(200).json({
                success: true,
                data: filteredArticles,
                message: `Articles order by ${sortBy}`
            })
        }
    }

    return res.status(200).json({
        success: true,
        data: filteredArticles,
        message: 'All articles'
    })

}

export { getAllArticles }