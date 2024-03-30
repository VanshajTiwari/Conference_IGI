const conversation=require('./../Models/Conversation');
const Users = require('./../Models/users');
exports.sendMessage=async(req,res)=>{
    const receiver=req.params.id;
    const msg=req.body.msg;
    try{
        const findConversation=await conversation.findOne({chatters:{$all:[receiver,req.session.user.id]}});
        if(!findConversation){
            const newConversation=new conversation({
                chatters:[req.session.user.id,receiver],
                messageDetails:{
                    senderId:req.session.user,
                    message:msg
                      }
            });
            newConversation.save();
            res.status(200).send("message Sent");
        }
        else{
            (findConversation.messageDetails).push({
                senderId:req.session.user,
                message:msg
            });
            findConversation.save();
            res.status(200).send("Guru bole toh kuch samj nhi aa raha");
        }
    }
    catch(err){
        res.status(500).json({ "status": "failed", Error: err.message });
    }
}
exports.viewsMessage=async (req,res)=>{
    const chats=await conversation.find({receiver:req.params.id}).populate('receiver sender');

    res.status(200).json({
        status:"success",
        data:chats
    }); 
}
exports.deleteAll=async(req,res)=>{ 
    await conversation.deleteMany({});
    res.status(204).send();
}
exports.superChattingControllers=async(req,res)=>{

    //1) refrence of user
try{    
   // console.log("Runned");
    const receiverId=req.params.id;
   // console.log(req.body.sender);
    const {sender,message}=req.body;
    const senderId=await Users.findById(sender);
    const Obj={senderId,message};
    if(!receiverId){
            let newChat=await conversation.findOne({chatters:{$all:['super','chats']}});
            
            if(!newChat){
                newChat=new conversation({
                    chatters:['super',"chats"],
                    messageDetails:[Obj]
                });
                newChat.save({validateBeforSave:false});
                return;
             //   return;

            }
            (newChat.messageDetails).push(Obj);
            newChat.save();
            res.status(200).send("already modified");
            return ;
    }

    let priChats=await conversation.findOne({chatters:{$all:[receiverId,senderId.id]}});
    if(!priChats){
        priChats=new conversation({
            chatters:[receiverId,senderId.id],
            messageDetails:[Obj]
        });
        priChats.save({validateBeforSave:false});
        return;
      //  return res.status(200).send("send");
    }
    (priChats.messageDetails).push(Obj);
    priChats.save();
    res.status(200).send("already modified")
}

    catch(err){
        console.log(err);
        res.status(200).json({status:"success",err:err});
    }
    // 2) get message of user
    
    //3) create Object

    //4) save to mongo

}; 
exports.getSuperChats=async(req,res)=>{
    if(req.query.receiver==""){
        let superChat=await conversation.findOne({chatters:{$all:['super','chats']}}).populate({path:"messageDetails",populate:{path:"senderId"}});
        if(!superChat){
            return;
        }
        res.status(200).json({status:"success",chats:superChat.messageDetails});
    }
    else{
        let superChat=await conversation.findOne({chatters:{$all:[req.query.receiver,req.query.send]}}).populate({path:"messageDetails",populate:{path:"senderId"}});
        
        if(!superChat){
            return;
        }
        res.status(200).json({status:"success",chats:superChat.messageDetails});
    }

} 