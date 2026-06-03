import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { registerSchema, loginSchema, validate } from "../validators/authValidator.js";

const authController = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
authController.post('/register', isGuest, validate(registerSchema), async (req, res) => {
    const authData = req.body;

    try {
        const result = await authService.register(authData)
        res.cookie('auth', result.token, { httpOnly: true })

        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message }).end()
    }
})

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
authController.post('/login', isGuest, validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await authService.login(email, password)

        res.cookie('auth', result.token, { httpOnly: true })

        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message }).end()
    }
})

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     tags: [Auth]
 *     summary: Logout current user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
authController.get('/logout', isAuth, (req, res) => {
    try {
        res.clearCookie('auth')
        return res.status(200).json({ message: 'Logout successfully!' })
    } catch (error) {
        console.log(error.message);
        res.status(403).json({ message: error.message })
    }
})

export default authController;
