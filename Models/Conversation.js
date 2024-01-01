const Mongoose=require('mongoose');

const conversation=Mongoose.Schema({
    chats:[
        {
            sender:{
                type:Mongoose.Schema.Types.ObjectId,
                ref:"users",
                required:[true,"sender undefined"]
            },
            receiver:{
                    type:Mongoose.Schema.Types.ObjectId,
                    ref:"users",
                    required:[true,"sender undefined"]
            },
            message:{
                type:String,
                minlength:1,
            },
            createAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]

}
// ,{ strictPopulate: false }
);

const Conversation=Mongoose.model("conversation",conversation);
module.exports=Conversation;