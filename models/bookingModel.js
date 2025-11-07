import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    property:{type:mongoose.Schema.Types.ObjectId,ref:"Property",required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    host:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    checkIn:{type:Date,required:true},
    checkOut:{type:Date,required:true},
    guests:{type:Number,required:true,min:1},
    totalPrice:{type:Number,required:true},
    paymentStatus:{type:String,enum:["Pending","Completed","Failed","Refunded"],default:"Pending"},
    bookingStatus:{type:String,enum:["pending", "confirmed", "cancelled", "completed"],default:"pending"},
    transactionId:{type:String},
    cancellationReason:{type:String},
},
{timestamps:true}
)

export default mongoose.model("Booking",bookingSchema);