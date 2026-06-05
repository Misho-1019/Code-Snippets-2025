import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies['auth']

    if (!token) return next();

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        req.user = decodedToken;
        res.locals.user = decodedToken;

        next();
    } catch (error) {
        res.clearCookie('auth')
        next()
    }
}

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized'})
        return
    }

    next();
}

export const isGuest = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user) {
        res.status(403).json({ message: 'You are already logged in!' });
        return
    }

    next()
}
