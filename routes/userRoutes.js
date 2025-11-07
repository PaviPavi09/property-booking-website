import express from 'express';
import {getAllUsers,getUserById,updateUser,deleteUser,changeUserRole} from '../controllers/userController.js';
import { authMiddleware,adminOnly } from '../middlewares/authMiddleware.js';

const router=express.Router()

router.get("/",authMiddleware,adminOnly,getAllUsers);
router.get("/:id",authMiddleware,getUserById);
router.put("/:id",authMiddleware,updateUser);
router.delete("/:id",authMiddleware,adminOnly,deleteUser);
router.patch("/:id/role",authMiddleware,adminOnly,changeUserRole);

export default router;