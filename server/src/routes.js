import { Router } from "express";
import authController from "./controllers/authController";

const routes = Router();

routes.use('/auth', authController)

export default routes;