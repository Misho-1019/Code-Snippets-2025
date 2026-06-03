import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    status?: number;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack || err.message)

    const status = err.status || 500
    const message = err.message || 'Internal server error'

    res.status(status).json({ message })
}
