const Express=require('express');
const Router=Express.Router();
const multer = require('multer');
const path=require('path');
const sharedFileModel=require('./../Models/sharedFileModel');
const storage=multer.diskStorage({
  destination:"./Public/uploads", 
  filename:(req,file,cb)=>{
    req.file=file;
    const filename=path.basename(file.originalname)+path.extname(file.originalname);
    cb(null,filename);
  }
});
const upload=multer({
  storage:storage,
}).single('file');

  
exports.uploadFileController=(req,res)=>{
  
  upload(req,res,async (err)=>{
  if(err){
    console.log(err);
  }
  else{
    const sharedFileObj=new sharedFileModel({
      name:path.basename(req.file.originalname),
      file_type:path.extname(req.file.originalname),
      sender:req.body.senderID,
      receiver:req.body.receiverID
    });
    await sharedFileObj.save();
    res.status(200).json({status:"success",data:sharedFileObj});
  }
})};

exports.getsharedFileData=async (req,res)=>{
  const AllFiles=await sharedFileModel.find({});
  res.render('sharedFiles.ejs',{files:AllFiles});
};



// Router.get("/template",async (req,res)=>{
//   const AllFiles=await sharedFileModel.find({});
 
//   res.render("sendtemplate.ejs",{files:AllFiles});
// });


// module.exports=Router;