const Express=require('express');
const router=Express.Router();
const {getAllUsers}=require('./../Controllers/userControllers');
const {login,signup,protect,fillD,logout,forgetPassword, isLoggedin}=require("./../Controllers/authController");
router.get("/getAllusers",getAllUsers)
      .get("/logout",logout)
      .post("/signup",signup)
      .post("/login",login)
      .post("/forget",forgetPassword);
router.use(isLoggedin);
router.post("/fillDetails",fillD);
module.exports=router;