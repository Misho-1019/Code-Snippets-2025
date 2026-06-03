import { z } from 'zod'

export const registerSchema = z.object({
    username: z.string().min(1, 'Username is required').min(2, 'Username must be at least 2 characters'),
    email: z.string().email('Email must be valid'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
    email: z.string().email('Email must be valid'),
    password: z.string().min(1, 'Password is required'),
})

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({
            errors: result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        })
    }
    req.body = result.data
    next()
}
