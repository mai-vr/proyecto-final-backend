const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode
    const message = err.message

    res.status(statusCode).json({
        success: false,
        error: message
    })
}

export { errorHandler }