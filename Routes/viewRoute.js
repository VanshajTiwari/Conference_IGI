const Express=require('express');
const Route=Express.Router();


Route.get("/",(req,res)=>{ 
            res.status(200).render('index.ejs',{title:"Home"});
});
Route.get("/dashboard",(req,res)=>{
    res.status(200).render("dashboard.ejs",{title:"Dashboard"});
})
Route.get("/dashboard/meeting",(req,res)=>{
    res.status(200).render("meeting.ejs",{title:"Meeting"});
})
Route.get("/login",(req,res)=>{
    res.status(200).render("login.ejs",{title:"Login"});
})
Route.get("/signup",(req,res)=>{
    res.status(200).render("signup.ejs",{title:"Signup"});
})
Route.get("/dashboard/chats",(req,res)=>{
    res.status(200).render("chat.ejs",{title:"Chatting"});
})
Route.get("/dashboard/allmeeting",(req,res)=>{
    res.status(200).render("AllMeeting.ejs",{title:"Schedules"});
})
Route.get("/dashboard/profile",(req,res)=>{
    res.status(200).render("profile.ejs",{title:"Profile"});
})

module.exports=Route;