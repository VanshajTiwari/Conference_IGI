const Mongoose=require('mongoose');


const meetingSchema=new Mongoose.Schema({
    createdBy:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:[true,"created must Assigned"]
    },
    host:[{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }],
    meetingID:{
        type:String,
        required:[true,"username is required for meeting"]
    },
    password:{
        type:String,
        required:[true,"password i required for meeting"]
    },
    meetingLink:{
        type:String
    },
    cohost:[{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    participants:{
        type:Mongoose.Schema.Types.ObjectId, 
        ref:"users"
    },
    createdAt:{
        type:Date,
        required:[true,"Meeting is Scheduled"],
        default:Date.now()
    },
    startAt:{
        type:Date,
        required:[true,"start timeing must be given"]
    },
    endAt:{
        type:Date
    },
    agenda:{
        type:String,
        required:[true,"meeting is Scheduled agenda"]
    }
});

module.exports=new Mongoose.model('meetings',meetingSchema);