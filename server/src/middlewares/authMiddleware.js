import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || 'BASICSECRET';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies['auth']

    if (!token) return next();

    try {
        const decodedToken = jwt.verify(token, SECRET)

        req.user = decodedToken;
        res.locals.user = decodedToken;

        next();
    } catch (error) {
        res.clearCookie('auth')
        return res.status(401).json({ message: 'Invalid token' })
    }
}

export const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized'})
    }

    next();
}

export const isGuest = (req, res, next) => {
    if (req.user) {
        return res.json({ message: 'You are already logged in!'})
    }

    next()
}