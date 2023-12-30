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
    chat:{
        type:String
    },
    sentime:{
        type:Date,
        default:Date.now()}

}
// ,{ strictPopulate: false }
);

const Conversation=Mongoose.model("conversation",conversation);
module.exports=Conversation;