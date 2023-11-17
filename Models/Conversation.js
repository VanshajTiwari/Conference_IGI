const Mongoose=require('mongoose');

const conversation=Mongoose.Schema({
    sender:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    receiver:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    msg:{
        type:String
    },
    sentime:Date.now()

});

const Conversation=Mongoose.model("conversation",conversation);
module.exports=Conversation;