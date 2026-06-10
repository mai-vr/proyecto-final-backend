const routeErrorHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'The route does not exist'
    })
}

export { routeErrorHandler }