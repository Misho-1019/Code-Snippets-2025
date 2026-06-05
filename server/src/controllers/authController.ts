import { Router, Request, Response } from "express";
import authService from "../services/authService.js";
import User from "../models/User.js";
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
authController.post('/register', isGuest, validate(registerSchema), async (req: Request, res: Response) => {
    const authData = req.body;

    try {
        const result = await authService.register(authData)
        res.cookie('auth', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })

        res.status(201).json(result)
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed'
        res.status(400).json({ message })
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
authController.post('/login', isGuest, validate(loginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authService.login(email, password)

        res.cookie('auth', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })

        res.status(200).json(result)
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Login failed'
        res.status(400).json({ message })
    }
})

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id: { type: string }
 *                 email: { type: string }
 *                 username: { type: string }
 *       401:
 *         description: Unauthorized
 */
authController.get('/me', isAuth, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user!.id).select('-password')
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
        })
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user' })
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
authController.get('/logout', isAuth, (req: Request, res: Response) => {
    try {
        res.clearCookie('auth')
        res.status(200).json({ message: 'Logout successfully!' })
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        res.status(500).json({ message: 'Logout failed' })
    }
})

export default authController;
