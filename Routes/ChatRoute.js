const chatMethods=require('./../Controllers/chatController');
const Express=require('express');
const Route=Express.Router();


Route.get("/:id/test",(req,res)=>res.status(200).send("working"))
.post('/:id',chatMethods.sendMessage)
.delete("/:id",chatMethods.deleteAll)
.get("/:id",chatMethods.viewsMessage);



module.exports=Route;