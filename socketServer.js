const io=require("./App").io;
const meeting=io.of("/meetings");
let Candidates=[];
meeting.on('connection',(socket)=>{
    const ComUser=socket.handshake.auth.userName;
    Candidates.push({ComUser,id:socket.id})
    console.log("Inside Meeting Channel");
    socket.on("disconnect",()=>{
        console.log("disconnected from nameSpace");
    }); 
    socket.on("joining",(data)=>{
        socket.join(data);
    })
    

    socket.on("addRequest",({id,ComUser,roomName})=>{
        socket.emit("newUserAdded",Candidates);
    });
    socket.on("addCandidates",()=>{
        
        socket.emit("newUser",Candidates);
    });
    socket.on("pattha",()=>{
        socket.emit("newUser",Candidates);
    })
    socket.on("sendMsgInMeeting",({roomName,msg})=>{
          socket.except(socket.id).emit('receive-message-in-meeting',{msg,ComUser});
 
     });
 
})


module.exports=io;