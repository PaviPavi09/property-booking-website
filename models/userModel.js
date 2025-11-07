import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    password:{type:String,required:true,minlength:6},
    role:{type:String,enum:['guest','admin','host'],default:'guest'},
    phone:{type:String,trim:true},
    profileImage:{type:String,trim:true,default:''},
    isVerified:{type:Boolean,default:false},
    resetPasswordToken:{type:String,default:null},
    resetPasswordExpires:{type:Date,default:null},
},{timestamps:true}
);
 export default mongoose.model('User',userSchema);