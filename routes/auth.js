const express=require('express');
const authController =require('../controllers/auths.js');
const uploadController =require('../controllers/filesUpload.js');


const router=express.Router();

// user registration AND addes file upload middle ware in between

router.post('/registration',
uploadController.uploadUserPhoto,
uploadController.resizeUserPhoto,
authController.registration);
// user sign in
router.post('/signin',authController.signin);

module.exports=router;