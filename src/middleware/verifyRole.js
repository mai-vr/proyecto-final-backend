import jwt from 'jsonwebtoken'

const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userLogged) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized access - User must be logged'
            })
        }
        if (!allowedRoles.includes(req.userLogged.role)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            })
        }
        next() // If the user has the right role they can continue using the page.
    }
}

export { verifyRole }