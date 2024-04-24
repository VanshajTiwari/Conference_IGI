const Express=require('express');
const router=Express.Router();
const uploadImg=require("./../utils/uploadImage");
const {getAllUsers, handleProfile}=require('./../Controllers/userControllers');
const {login,signup,protect,fillD,logout,forgetPassword,getVerified, isLoggedin, resetForgotPassword, updatePassword}=require("./../Controllers/authController");
const { uploadFileController, getsharedFileData } = require('../Controllers/shareFileController');
const sendEmail=require("./../utils/sendEmail");
const Users = require('../Models/users');
router.get("/getAllusers",getAllUsers)
.get("/sendVerified/:id",async (req,res)=>{
      const {id}=req.params;
      const user=await Users.findById(id).populate('InstitutionDetails');
      sendEmail.getVerified({
            data: user,
            url:`${req.protocol}://${req.get('host')}`,
            subject: 'Approve Account',
            message: `Request for Approval`,
      })
      res.send("sent!");
}) 
      .get("/api/v1/approve/:id",getVerified)
      .get("/logout",logout)
      .post("/signup",signup)
      .post("/login",login)
      .post("/forget",forgetPassword)
      .get("/forgetpassword",(req,res)=>res.render("forgotPassword.ejs",{title:"forgotPassword"}))
      .get("/forget/:token",(req,res)=>res.render("forgetPassword.ejs",{title:"forgetPassword",token:req.params.token}))
      .post("/forget/:token",resetForgotPassword);
      router.use(isLoggedin);
     router.post("/uploadfile",(req,res)=>uploadFileController(req,res));
    //  router.get("/getsharedFile",getsharedFileData);
      router.post("/updatePassword/:id",updatePassword);
      router.post("/fillDetails",fillD);
      router.post('/uploadprofile',uploadImg.single('files'),handleProfile);;
module.exports=router;