const Mongoose=require('mongoose');


const sharedFile=new Mongoose.Schema({
    name:{
        type:String,
        required:[true,"file name must be there"],
    },
    file_type:{
        type:String,
        required:[true,"type is empty"]
    },
    sender:{
        type:String,
        required:[true,"sender details not given"],
    },
    receiver:{
        type:String,
        require:[true,"receiver not assigned"]
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }

});
module.exports=Mongoose.model("sharedFile",sharedFile);