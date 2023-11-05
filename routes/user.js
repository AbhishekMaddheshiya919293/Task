const express=require('express');
const userController=require('../controllers/users.js');
const verifyToken=require("../verifyToken.js");
const router=express.Router();
//In entire module verifyToken is used for authenticate user  acces

router.get('/all-registration',verifyToken,userController.getAllRegistration);
//Route handler for sending friend request
router.put('/:connection_id/sendFriendRequest',verifyToken,userController.sendFriendRequest);
//Route handler for accepting friend request
router.put('/:request_id/acceptFriendRequest',verifyToken,userController.acceptFriendRequest);
//Route handler for getting friend suggestion we are not taking any database for friendsSuggestion field
router.get('/friendsSuggestion',verifyToken,userController.friendSuggestion);
module.exports=router;