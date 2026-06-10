import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized - Must include a header that starts with: Bearer'
        })
    }

    const token = header.split(' ')[1] // The first word is 'Bearer', we need the next string that is the token.
    const secretKey = process.env.JWT_SECRET

    try {
        const decoded = jwt.verify(token, secretKey)
        req.userLogged = decoded // Create a property on the request that contains the data from the user (payload).

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            success: false,
            error: `Unauthorized - ${error.message ? error.message : 'The header or token is wrong'}`
        })
    }
}

export { authMiddleware }