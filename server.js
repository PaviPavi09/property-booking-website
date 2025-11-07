import express from "express"
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", JSON.stringify(error, null, 2));
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", JSON.stringify(error, null, 2));
});



dotenv.config();
const app = express();

app.use(express.json())
//routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/properties",propertyRoutes);
app.use("/api/reviews",reviewRoutes);


// Connect to MongoDB
mongoose.connect(process.env.mongodb_URI)
.then(()=>console.log("MongoDB connected successfully"))
.catch((error)=>console.log("MongoDB connection failed:",JSON.stringify(error)))

app.get("/",(req,res)=>{
    res.send("Property Rental API is running")
})

const PORT=process.env.PORT||5000
app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))