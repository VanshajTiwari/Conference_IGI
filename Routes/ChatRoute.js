const chatMethods=require('./../Controllers/chatController');
const Express=require('express');
const Route=Express.Router();


Route.get("/:id/test",(req,res)=>res.status(200).send("working"))
.get("/showmsg",chatMethods.getSuperChats)
.post("/sendmsg/:id?",chatMethods.superChattingControllers)
// .post('/:id',chatMethods.sendMessage)
// .delete("/:id",chatMethods.deleteAll)
.get("/:id",chatMethods.getSuperChats)


module.exports=Route;