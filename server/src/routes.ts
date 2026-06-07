import { Router, Request, Response } from "express";
import authController from "./controllers/authController.js";
import snippetController from "./controllers/snippetController.js";
import userController from "./controllers/userController.js";
import mongoose from "mongoose";

const routes = Router();

routes.use('/auth', authController)
routes.use('/snippets', snippetController)
routes.use('/users', userController)

routes.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
    })
})

export default routes;
