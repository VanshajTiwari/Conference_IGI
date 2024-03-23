const Express=require("express");
const path=require("path");
const App=Express();
const cors=require("cors");
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const userRouter=require("./Routes/userRoute");
const chatRouter=require("./Routes/ChatRoute");
const viewRouter=require('./Routes/viewRoute');
const meetingRoute=require("./Routes/meeting");
const {Server}=require('socket.io');
const expressSession=require('express-session');
//SET VIEW ENGINE
App.use(cors());
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
App.use("/chats",chatRouter);
App.use("/users",userRouter);
App.use("/",viewRouter);
App.use("/meeting",meetingRoute);
App.all("*",(req,res)=>{
    res.status(404).render("404page.ejs");
});
let users=0;
let roomObj={};
io.on("connection",(socket)=>{
    socket.on("join-room",async (data)=>{
        roomObj=await data;
        // console.log(roomObj);
        socket.join(roomObj.roomId);
   //   console.log(`${roomObj.userName} joined room ${JSON.stringify(roomObj)} ID`);
        // console.log(roomObj);
        users++;
        
      });

    socket.on('user-data',(user)=>{
            console.log(user);
    });
    // socket.on('all-users',({roomID})=>{
    //     rooms.add(roomID);
      
    // });
   // console.log("connected Users");
    socket.on("disconnect",()=>{console.log("disconnected")});
    socket.on('send-message',({message,senderId,user})=>{
            const rooms = io.sockets.adapter.rooms;
      //      console.log(rooms);
         socket.to(roomObj.roomId).except(senderId).emit('receive-message',{message,user});
       // io.except(senderId).to(roomObj.roomID).emit('receive-message',{message,user});
    });
});
//io.to(roomObj.roomID).emit('send-message-room',{message:"hello"});
// io.to(roomObj.roomID).emit('send-message',{message,user});    
 
module.exports={App}; 