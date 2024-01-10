const Express=require('express');
const router=Express.Router();
const uploadImg=require("./../utils/uploadImage");
const {getAllUsers, handleProfile}=require('./../Controllers/userControllers');
const {login,signup,protect,fillD,logout,forgetPassword, isLoggedin, resetForgotPassword, updatePassword}=require("./../Controllers/authController");
router.get("/getAllusers",getAllUsers)
      .get("/logout",logout)
      .post("/signup",signup)
      .post("/login",login)
      .post("/forget",forgetPassword)
      .get("/forgetpassword",(req,res)=>res.render("forgotPassword.ejs",{title:"forgotPassword"}))
      .get("/forget/:token",(req,res)=>res.render("forgetPassword.ejs",{title:"forgetPassword",token:req.params.token}))
      .post("/forget/:token",resetForgotPassword);
      router.use(isLoggedin);
      router.post("/updatePassword/:id",updatePassword);
      router.post("/fillDetails",fillD);
      router.post('/uploadprofile',uploadImg.single('files'),handleProfile);;
module.exports=router;