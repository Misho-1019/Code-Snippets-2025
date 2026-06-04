import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const registerSchema = z.object({
    username: z.string().min(1, 'Username is required').min(2, 'Username must be at least 2 characters'),
    email: z.string().email('Email must be valid'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
    email: z.string().email('Email must be valid'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues.map((issue: z.ZodIssue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
        return
    }
    req.body = result.data
    next()
}
