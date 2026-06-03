import express from 'express'
import cookieParser from 'cookie-parser'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { errorHandler } from '../middlewares/errorHandler.js'
import routes from '../routes.js'

export const createTestApp = () => {
    const app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use(authMiddleware)
    app.use(routes)
    app.use(errorHandler)
    return app
}
