import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { body, validationResult } from "express-validator";

const authController = Router();

authController.post('/register', isGuest, [
    body('username').notEmpty().withMessage('Username is required!').isString().withMessage('Username must be a string!'),
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters!'),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const authData = req.body;

    try {
        const result = await authService.register(authData)
        res.cookie('auth', result.token, { httpOnly: true })

        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message }).end()
    }
})

authController.post('/login', isGuest, [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password').notEmpty().withMessage('Password is required!'),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body;

    try {
        const result = await authService.login(email, password)

        res.cookie('auth', result.token, { httpOnly: true })

        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message }).end()
    }
})

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