const Express=require("express");
const path=require("path");
const App=Express();
const cookieParser=require('cookie-parser');
const userRouter=require("./Routes/userRoute");
const chatRouter=require("./Routes/ChatRoute");
const viewRouter=require('./Routes/viewRoute');
//SET VIEW ENGINE
App.use(cookieParser());
App.use(Express.json());
App.use(Express.urlencoded({extended:true}));
App.use("/",Express.static(path.join(__dirname,"public")));
App.set("view-engine","ejs");
App.set("views",path.join(__dirname,"views"));

//App.use(bodyParser({extended:true}));

App.use("/",viewRouter);
App.use("/users",userRouter);
App.use("/users",chatRouter);
App.all("*",(req,res)=>{
    res.status(404).render("404page.ejs");
});

module.exports=App;