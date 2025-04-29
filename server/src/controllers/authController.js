import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";

const authController = Router();

authController.post('/register', isGuest, async (req, res) => {
    const authData = req.body;

    try {
        const token = await authService.register(authData)
        res.cookie('auth', token, { httpOnly: true })

        res.status(201).json({ message: 'User registered successfully!' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

authController.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password)
        
        res.cookie('auth', token, { httpOnly: true })
        
        res.status(200).json({ message: 'User login successfully!' })
    } catch (err) {
        res.status(400).json({ message: 'Bad request!' })
    }
})

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth')
    return res.status(200).json({ message: 'Logout successfully!' })
})

export default authController;