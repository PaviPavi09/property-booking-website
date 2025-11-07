import express from 'express';
import {createProperty,getAllProperties,getPropertyById,updateProperty,deleteProperty,getHostProperties} from '../controllers/propertyController.js';
import { authMiddleware, hostOnly } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, hostOnly, upload.array("images", 5), createProperty);
router.get("/host/properties", authMiddleware, hostOnly, getHostProperties);
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.put("/:id", authMiddleware, hostOnly, upload.array("images", 5), updateProperty);
router.delete("/:id", authMiddleware, hostOnly, deleteProperty);

export default router;
