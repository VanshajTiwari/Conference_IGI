const Express=require('express');
const router=Express.Router();
const {getAllUsers}=require('./../Controllers/userControllers');
const {login,signup,protect,fillD,logout,forgetPassword}=require("./../Controllers/authController");
router.get("/getAllusers",getAllUsers)
      .get("/logout",logout)
      .post("/signup",signup)
      .post("/login",login)
      .post("/fillDetails",fillD)
      .post("/forget",forgetPassword)
module.exports=router;