import express from 'express';
import { createBooking,GetMyBookings,GetHostBookings,CancelBooking } from '../controllers/bookingController.js';
import { authMiddleware,adminOnly } from '../middlewares/authMiddleware.js';

const router=express.Router()

router.post ("/",authMiddleware,createBooking);
router.get("/mybookings",authMiddleware,GetMyBookings);
router.get("/host/bookings",authMiddleware,GetHostBookings);
router.delete("/cancel/:id",authMiddleware,CancelBooking);

export default router;
