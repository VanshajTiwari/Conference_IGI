const Express=require("express");
const path=require("path");
const App=Express();
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const userRouter=require("./Routes/userRoute");
const chatRouter=require("./Routes/ChatRoute");
const viewRouter=require('./Routes/viewRoute');
const meetingRoute=require("./Routes/meeting");
const {Server}=require('socket.io');
const expressSession=require('express-session');
//SET VIEW ENGINE
App.use(morgan("dev"));
App.use(cookieParser());
App.use(Express.json());
App.use(Express.urlencoded({extended:true}));
App.use("/",Express.static(path.join(__dirname,"Public")));


App.set("view-engine","ejs");
App.set("views",path.join(__dirname,"views"));

//App.use(bodyParser({extended:true}));
const io=new Server(App.listen("7575",()=>{console.log("http://127.0.0.1:7575")}));


App.use(expressSession({
    secret:"knsdnakfnd",
    resave:false,
    saveUninitialized:false
}))
App.use("/users",userRouter);
App.use("/",viewRouter);
App.use("/users",chatRouter);
App.use("/meeting",meetingRoute);
App.all("*",(req,res)=>{
    res.status(404).render("404page.ejs");
});
let rooms=[];
io.on("connection",(socket)=>{
    console.log("connected Users");
    const roomsSocket=socket.rooms;
    roomsSocket.forEach(ele=>{rooms.push(ele)});
    socket.emit('show-rooms',{rooms});
    socket.on("send-rooms",({id})=>{
                    socket.join(id)
                    
    });
    console.log(rooms);
    socket.on("disconnect",()=>{console.log("disconnected")});
    socket.on('send-message',({message,senderId})=>{
        socket.except(senderId).emit('receive-message',{message});
    });
});

      
 
module.exports={App};