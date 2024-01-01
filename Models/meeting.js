const Mongoose=require('mongoose');


const meetingSchema=new Mongoose.Schema({
    host:[{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"users"
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
        required:[true,"Meeting is Scheduled"]
    },
    endAt:{
        type:Date
    },
    type:{
        type:String,
        required:[true,"meeting is Scheduled"]
    }
    ,
    agenda:{
        type:String,
        required:[true,"meeting is Scheduled"]
    }
})