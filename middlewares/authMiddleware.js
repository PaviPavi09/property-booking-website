import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
    try {
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return  res.status(401).json({message:"Not authorized, token missing"});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=await User.findById(decoded.id).select("-password");
    if(!req.user){
        return res.status(401).json({message:"No user found with this token"});
    }
    next();
}
catch(error){
    console.error("Auth Middleware Error:",error);
    res.status(401).json({message:"Not authorized, token failed"});
}
};

export const adminOnly=async(req,res,next)=>{
    if(req.user&&req.user.role==="admin"){
    next();
    }
    else{
        return res.status(403).json({message:"Not authorized as an admin"});
    }
}

export const hostOnly=async(req,res,next)=>{
    if(req.user&&req.user.role==="host"){
    next();
    }
    else{
        return res.status(403).json({message:"Not authorized as a host"});
    }
}