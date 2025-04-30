import { Router } from "express";
import authController from "./controllers/authController.js";
import snippetController from "./controllers/snippetController.js";

const routes = Router();

routes.use('/auth', authController)
routes.use('/snippets', snippetController)

export default routes;