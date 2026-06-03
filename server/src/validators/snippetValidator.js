import { z } from 'zod'

export const createSnippetSchema = z.object({
    title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
    description: z.string().min(1, 'Description is required'),
    code: z.string().min(1, 'Code is required'),
    language: z.string().min(1, 'Language is required'),
})

export const updateSnippetSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().optional(),
    code: z.string().optional(),
    language: z.string().optional(),
})

export const createCommentSchema = z.object({
    text: z.string().min(1, 'Comment text is required'),
})

export const paginationSchema = z.object({
    page: z.coerce.number().positive().optional(),
    limit: z.coerce.number().positive().max(100).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    language: z.string().optional(),
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

export const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
        return res.status(400).json({
            errors: result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        })
    }
    next()
}
