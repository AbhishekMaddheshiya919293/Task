const multer=require("multer");
const sharp=require("sharp");
const createError=require('../error.js')
const multerStorage=multer.memoryStorage();
const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true);
    }else{
        cb(new Error("not image"))
    }
};
const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});
const uploadUserPhoto=upload.single("photo");

const resizeUserPhoto=async(req,res,next)=>{
    console.log(req)
    if(!req.file){
        const customError=createError(403,"Please Upload Image");
        next(customError);
    }
    console.log('fileupload')
    req.body.filename=`uplaod-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize(800,500)
    .toFormat("jpeg")
    .jpeg({quality:90})
    .toFile(`public/uploadfile/${req.body.filename}`);
    next();
}
module.exports={uploadUserPhoto,resizeUserPhoto}
