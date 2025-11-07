import mongoose from "mongoose";
import userModel from "./userModel.js";

const reviewSchema=new mongoose.Schema({
    property:{type:mongoose.Schema.Types.ObjectId,ref:'Property',required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    rating:{type:Number,required:true,min:1,max:5},
    comment:{type:String,trim:true,default:''},
    host:{type:String,trim:true,default:''},
},{timestamps:true}
)

export default mongoose.model('Review',reviewSchema);