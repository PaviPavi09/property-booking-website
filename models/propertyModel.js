import mongoose from "mongoose";

const propertySchema=new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    location:{type:String,required:true,trim:true},
    pricePerNight:{type:Number,required:true},
    propertyType:{type:String,required:true,enum:["Apartment", "House", "Villa", "Cottage", "PG", "Hostel", "Room"]},
    amenities:[{type:String}],
    images:[{type:String,required:true}],
    maxGuests:{type:Number,required:true,min:1},
    availability:{type:[{date:{type:Date},isAvailable:{type:Boolean}}],default:[]},
    host:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    ratings:{type:Number,default:0,min:0,max:5},
    status:{type:String,enum:["pending", "approved", "rejected"],default:"pending"},
},
{timestamps:true}
)

export default mongoose.model("Property", propertySchema)