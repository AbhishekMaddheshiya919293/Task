const jwt=require("jsonwebtoken");
const createError=require('./error');
const verifyToken=(req,res,next)=>{
 const token=req.cookies.access_token
  if(!token){
    return next(createError(401,"You are not authenticated user"));
  }
  jwt.verify(token,process.env.JWT,(err,userId)=>{
    if(err){
        return next(createError(403,"token not authenticated"));
    }
    req.userId=userId;
    next();
  })
}

module.exports=verifyToken;