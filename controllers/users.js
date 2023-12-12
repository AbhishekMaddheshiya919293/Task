const mongoose=require("mongoose");
const createError=require('../error.js')
const User=require("../models/User.js");
const ObjectId = mongoose.Types.ObjectId;
const getAllRegistration=async(req,res,next)=>{
    try{
     const users=await User.find();
     //if there is no content available
     if(!users.length){
        const customError=createError(204,"no registration found");
        next(customError);
     }
    // sending all list of registration
    res.status(200).json(users);

    }catch(err){
     const customError=create(404,"OOPS we are down");
     next(customError);
    }
}
const sendFriendRequest=async(req,res,next)=>{
    if(req.userId!== req.params.connection_id){
        try{
            //connectionUser is to whom friend request has been sent
            const connectionUser=await User.findById(req.params.connection_id);

            console.log("connectionUser",connectionUser,req.userId);
            //To check weather person is already friend or not
            console.log(connectionUser.friends);
            //Here checking in both friends list and friendRequests list if request is present or not
            const matchCheckFriends=connectionUser.friends.filter((elem)=>elem===req.userId.id);
            const matchCheckFriendRequests=connectionUser.friendRequests.filter((elem)=>elem===req.userId.id);
            if(matchCheckFriends.length===0 && matchCheckFriendRequests.length===0){
               await connectionUser.updateOne({$push:{friendRequests:req.userId.id}});
               res.status(200).json("Friend request has been sent");
            }else{
                res.status(403).json("You have already sent friend request");
            }
        }catch(err){
            next(err);
        }
    }else{
        res.status(403).json("you can't send friend request to yourself");
    }
}

const acceptFriendRequest=async(req,res,next)=>{
    if(req.userId !==req.params.request_id){
        try{
        const currentUser=await User.findById(req.userId.id);
        const connectionUser=await User.findById(req.params.request_id);
        console.log(currentUser,connectionUser,currentUser.friendRequests,req.userId.id,req.params.request_id)
        const reqPerson=currentUser.friendRequests.includes(req.params.request_id);
        if(reqPerson){
             await currentUser.updateOne({$pull:{friendRequests:req.params.request_id}});
             await currentUser.updateOne({$push:{friends: req.params.request_id}});
             // updating friendlist for request sender after acceptin request
             await connectionUser.updateOne({$push:{friends: req.userId.id}});
             res.status(200).json("Friend request accepted");
        }else{
             res.status(403).json("User not found in your request list");
        }}catch(err){
            next(err);
        }
    }else{
        //since we already cover this case in friendRequests list 
        //but for extra layer tooken this case
        res.status(403).json("You can't yourself send friend request");
    }
}
const friendSuggestion=async(req,res,next)=>{
    try{
    const user=await User.findById(req.userId.id);
    //capturing promises here
    const listOfFriendsPromises=user.friends.map((id)=>User.findById(id))
    const listOfFriends=await Promise.all(listOfFriendsPromises);
    //here we are using set to avoid repetition
    const friendsSet=new Set();
    //HERE at max we will take 3 friend of friend in my suggestion list to optimise complexity to O(N)
    const suggestedFriend=[];
    listOfFriends.forEach((elem)=>{
        let maxOfElem=0;
        for(let i=0;i<elem.friends.length;i++){
            if(maxOfElem<3){
                friendsSet.add(elem.friends[i]);
                maxOfElem++;
            }
            else{
                break;
            }
        }});
       for(const id of friendsSet){
        //here we are getting suggested friend list iterating set
        suggestedFriend.push(id);
       }
       res.status(200).json({"data":suggestedFriend});
    }catch(err){
       next(err);
    }
}

module.exports={getAllRegistration,sendFriendRequest,acceptFriendRequest,friendSuggestion}
///i am iiii rr  r  t  gggg