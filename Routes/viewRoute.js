const Express=require('express');
const { isLoggedin } = require('../Controllers/authController');
const Route=Express.Router();
const meetingModel=require("./../Models/meeting");

Route.get("/",(req,res)=>{ 
            res.status(200).render('index.ejs',{title:"Home"});
});
Route.get("/login",(req,res)=>{
    res.status(200).render("login.ejs",{title:"Login"});
})
Route.get("/signup",(req,res)=>{
    res.status(200).render("signup.ejs",{title:"Signup"});
})

Route.use(isLoggedin);
Route.get("/dashboard",(req,res)=>{
    const user=req.session.user;
    res.render("dashboard.ejs",{title:"Dashboard",user:user});
});
Route.get("/dashboard/meeting",async (req,res)=>{
    const user=req.session.user;
    const meetings=await meetingModel.find({createdBy:user});
    res.status(200).render("meeting.ejs",{title:"Meeting",user,meetings});
})
Route.get("/dashboard/chats",(req,res)=>{
    const user=req.session.user;
    res.status(200).render("chat.ejs",{title:"Chatting",user});
})
Route.get("/dashboard/allmeeting",(req,res)=>{
    const user=req.session.user;
    res.status(200).render("AllMeeting.ejs",{title:"Schedules",user});
})
// Route.use(isLoggedin);
Route.get("/dashboard/profile",(req,res)=>{
    const user=req.session.user;
    res.status(200).render("profile.ejs",{title:"Profile",user});
})
Route.get("/dashboard/profile/filldetails",(req,res)=>{
    res.status(200).render('form.ejs',{title:"Profile",user:req.session.user});
})

module.exports=Route;