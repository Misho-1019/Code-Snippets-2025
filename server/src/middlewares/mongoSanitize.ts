import { Request, Response, NextFunction } from 'express'

function sanitize(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        return obj.map(sanitize)
    }
    if (obj && typeof obj === 'object') {
        const clean: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
            if (key.startsWith('$')) continue
            clean[key] = sanitize(value)
        }
        return clean
    }
    return obj
}

export const mongoSanitize = (req: Request, _res: Response, next: NextFunction): void => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitize(req.body)
    }
    if (req.query && typeof req.query === 'object') {
        const cleaned = sanitize(req.query) as Record<string, unknown>
        for (const key of Object.keys(req.query as Record<string, unknown>)) {
            if (!(key in cleaned)) {
                delete (req.query as Record<string, unknown>)[key]
            }
        }
    }
    next()
}
