import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const authController = Router();

authController.post('/register', async (req, res) => {
    const authData = req.body;

    try {
        await authService.register(authData)
        res.status(201).json({ message: 'User registered successfully!' })
    } catch (err) {
        res.status(400).json({ message: 'Bad request!' })
    }
})

authController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password)
        
        res.cookie('auth', token, { httpOnly: true })
        
    } catch (err) {
        res.status(400).json({ message: 'Bad request!' })
    }
})

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth')
    return res.status(200).json({ message: 'Logout successfully!' })
})

export default authController;