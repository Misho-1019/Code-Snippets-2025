import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const createSnippetSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(1, 'Description is required'),
    code: z.string().min(1, 'Code is required'),
    language: z.string().min(1, 'Language is required'),
    tags: z.array(z.string().trim().toLowerCase()).optional().default([]),
    visibility: z.enum(['private', 'public']).optional().default('private'),
})

export const updateSnippetSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().optional(),
    code: z.string().optional(),
    language: z.string().optional(),
    tags: z.array(z.string().trim().toLowerCase()).optional(),
    visibility: z.enum(['private', 'public']).optional(),
})

export const createCommentSchema = z.object({
    text: z.string().min(1, 'Comment text is required'),
})

export const paginationSchema = z.object({
    page: z.coerce.number().positive().optional(),
    limit: z.coerce.number().positive().max(100).optional(),
    search: z.string().optional(),
    language: z.string().optional(),
    tag: z.string().optional(),
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

export const validateQuery = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
        res.status(400).json({
            errors: result.error.issues.map((issue: z.ZodIssue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
        return
    }
    next()
}
