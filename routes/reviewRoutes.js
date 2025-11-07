import express from 'express';
import { createReview,getPropertyReviews,getUserReviews,updateReview,deleteReview } from '../controllers/reviewController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router=express.Router()

router.post("/",authMiddleware,createReview);
router.get("/property/:id",getPropertyReviews);
router.get("/myreviews",authMiddleware,getUserReviews);
router.put("/:id",authMiddleware,updateReview);
router.delete("/:id",authMiddleware,deleteReview);

export default router;