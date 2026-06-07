import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

function generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        if (!req.cookies[CSRF_COOKIE_NAME]) {
            const token = generateToken()
            res.cookie(CSRF_COOKIE_NAME, token, {
                httpOnly: false,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            })
        }
        next()
        return
    }

    const csrfCookie = req.cookies[CSRF_COOKIE_NAME]
    const csrfHeader = req.headers[CSRF_HEADER_NAME] as string | undefined

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        res.status(403).json({ message: 'Invalid or missing CSRF token' })
        return
    }

    next()
}
