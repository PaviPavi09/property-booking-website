export const errorHandler=(err,req,res,next)=>{
    console.log("Error Middleware Invoked");
    console.log(err.stack);

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Internal Server Error";

    if (err.name === "ValidationError") {
    message = Object.values(err.errors).map(val => val.message).join(", ");
    statusCode = 400;
  }
  if (err.code === 11000) {
    message = `Duplicate field value entered for ${Object.keys(err.keyValue)} field`;
    statusCode = 400;
  }
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please log in again.";
    statusCode = 401;
  }
     if (err.name === "TokenExpiredError") {
    message = "Your token has expired, please log in again";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};



