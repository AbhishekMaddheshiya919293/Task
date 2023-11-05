const mongoose=require("mongoose");
const createError=require('../error.js')
const User=require("../models/User.js");
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");

const registration=async (req, res, next) => {
    try {
      //generate new hased password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //spliting string by , to store as a multile hobby
      const hobbiesArray=req.body.hobbies.split(',');
      //create new user
      const newUser = new User({
        //here we are giving all required field to save
        //from unwanted data
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        //giving relative adddres of file in string form
        profilePicture:req.body.filename,
        department:req.body.department,
        about:req.body.about,
        hobbies:hobbiesArray,
      });
  
      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      const customError=createError(404,"User already exits")
      next(err);
    }
  }

const signin=async(req,res,next)=>{
    try{
       const user=await User.findOne({
        email:req.body.email
       });
       if(!user){
        return next(createError(404,"No user find"))
       }
       const isCorrect=await bcrypt.compare(req.body.password,user.password);
       if(!isCorrect){
        const customError=createError(404,"Provide correct credential")
        return next(customError);
       }
       //here using we can't show hashedPassword to client
       user.password=undefined;
       const token=jwt.sign({id:user._id},process.env.JWT);
       res.cookie("access_token",token,{
        httpOnly:true
       }).status(200).json({token,
        user});
    }catch(err){
       next(err);
    }
   }





module.exports={registration,signin};
