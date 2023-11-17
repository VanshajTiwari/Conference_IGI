const conversation=require('./../Models/Conversation');
const Users = require('./../Models/users');
exports.sendMessage=async(req,res)=>{
    receiver=req.params.id;
    try{
        const data=await Users.find({_id:receiver})
        const [sender,chat]=[req.body.sender,req.body.chat];
        await conversation.create({sender,receiver,chat}).catch(er=>er);;
        res.status(200).send("message Sent");
    }
    catch(err){
        res.status(500).json({ "status": "failed", Error: err });
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