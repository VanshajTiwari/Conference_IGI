const Express=require('express');
const router=Express.Router();
const {getAllUsers}=require('./../Controllers/userControllers');
const {login,signup,protect,forgetPassword}=require("./../Controllers/authController");
router.get("/getAllusers",protect,getAllUsers)
      .post("/signup",signup)
      .post("/login",login)
      .post("/forget",forgetPassword)
module.exports=router;