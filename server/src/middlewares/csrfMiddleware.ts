import { Request, Response, NextFunction } from 'express'

export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        next()
        return
    }

    const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
    const origin = req.headers['origin']

    if (!origin || origin !== allowedOrigin) {
        res.status(403).json({ message: 'Invalid or missing origin' })
        return
    }

    next()
}
