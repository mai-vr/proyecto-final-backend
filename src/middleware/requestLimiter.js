import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // Wait 5 minutes to try again.
    limit: 100, // 100 request is the limit.
    handler: (req, res) => {
        res.status(429).json({ status: 'Too many request, try again later.' })
    }
})

export { limiter }