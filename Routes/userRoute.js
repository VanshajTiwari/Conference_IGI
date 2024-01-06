const Express=require('express');
const router=Express.Router();
const uploadImg=require("./../utils/uploadImage");
const {getAllUsers, handleProfile}=require('./../Controllers/userControllers');
const {login,signup,protect,fillD,logout,forgetPassword, isLoggedin}=require("./../Controllers/authController");
router.get("/getAllusers",getAllUsers)
      .get("/logout",logout)
      .post("/signup",signup)
      .post("/login",login)
      .post("/forget",forgetPassword);
router.use(isLoggedin);
router.post("/fillDetails",fillD);
router.post('/uploadprofile',uploadImg.single('files'),handleProfile);;
module.exports=router;