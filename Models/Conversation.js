const Mongoose=require('mongoose');

const conversation=Mongoose.Schema({
    chatters:{
        type:Array,
        validate:{
            validator:function(val){
                return val.length==2;
            },
            message:"Parameters Not Satisfied"
        }
    },
    messageDetails:[{
        type:{
        senderId:{
                type:Mongoose.Schema.Types.ObjectId,
                ref:'Users',
            },
        message:{
                type:String},
        createdAt:{
            type:Date,
            default:Date.now()
        }
            }
        }],
});
// ,{ strictPopulate: false }
// conversation.pre("save",function(next){
//     console.log("I Worked");
//     next();
// })
conversation.pre('/^find/',function(next){
    this.populate({path:"chatter",select:"fullname"});
    this.populate({path:sendId,select:"fullname"});
    next();
})
const Conversation=Mongoose.model("conversation",conversation);
module.exports=Conversation;