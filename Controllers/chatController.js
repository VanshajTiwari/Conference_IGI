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
    console.log(req.params.id);
    const chats=await conversation.find({receiver:req.params.id}).populate('receiver sender');
    console.log(chats);;
    res.status(200).json({
        status:"success",
        data:chats
    });
}
exports.deleteAll=async(req,res)=>{ 
    await conversation.deleteMany({});
    res.status(204).send();
}