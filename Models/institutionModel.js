const Mongoose=require('mongoose');

const InstiSchema=new Mongoose.Schema({
    institution:String,
    institutionAddress:String,
    user:{
        type:Mongoose.Types.ObjectId,
        ref:"users"
    },
    userAddres:String,
    username:{
        type:String,
        distinct:true,
        required:[true,"username missing"]
    },
    role:{
        type:String,
        role:['faculty',"student","staff","dean","registerar"],
        required:[true,'users belongs to Role']

    },
    mobile:{
        type:Number,
        require:[true,"number Required"]
    },
    TimeZone:{
        type:Date
    }
});

module.exports=Mongoose.model("institutionschema",InstiSchema);