const Express=require("express");
const path=require("path");
const App=Express();
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const userRouter=require("./Routes/userRoute");
//SET VIEW ENGINE
App.use(Express.json());
App.use(Express.urlencoded({extended:true}));
App.use("/",Express.static(path.join(__dirname,"public")));
App.set("view-engine","ejs");
App.set("views",path.join(__dirname,"views"));

//App.use(bodyParser({extended:true}));


App.use("/users",userRouter);
App.all("*",(req,res)=>{
    res.status(404).send("PAge not found");
})

module.exports=App;