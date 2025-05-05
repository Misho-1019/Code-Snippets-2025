import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";

const authController = Router();

authController.post('/register', isGuest, async (req, res) => {
    const authData = req.body;

    try {
        const result = await authService.register(authData)
        res.cookie('auth', result.token, { httpOnly: true })

        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({ message: err.message }).end()
    }
})

authController.post('/login', isGuest, async (req, res) => {
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