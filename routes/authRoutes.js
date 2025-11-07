import express from 'express';
import {RegisterUser,LoginUser,GetUser} from '../controllers/authController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router=express.Router();
router.post("/register",RegisterUser);
router.post("/login",LoginUser);
router.get("/profile",authMiddleware,GetUser);
export default router;