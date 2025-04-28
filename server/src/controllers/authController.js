import { Router } from "express";

const authController = Router();

authController.post('/register', async (req, res) => {
    const authData = req.body;

    console.log(authData);
    
    res.end();
})

export default authController;