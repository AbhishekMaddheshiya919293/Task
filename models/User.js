const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      required:true,
    },
    department:{
        type:String,
        required:true,
        max:50,
    },
    friends:{
        type:Array,
        default:[],
    },
    friendRequests:{
        type:Array,
        default:[],
    },
    about: {
      type: String,
      required:true,
      max: 50,
    },
    hobbies: {
      type: Array,
      required: true,
    },
  }
);

const user= mongoose.model("User", UserSchema);
module.exports=user;