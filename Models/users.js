const Mongoose=require("mongoose");
const validator=require('validator');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const usersSchema=new Mongoose.Schema({
    fullname:{
        type:String,
        minlength:1,
        required:[true,"Invalid Name"],
        
    },
    email:{
        type:String,
        required:[true,"User Must Have Email"],
        validate:[validator.isEmail,"Please Provide Valid Email"],
    },
    password:{ 
        type:String,
        require:[true,"Users Must Have Password"]
    },
    confirmpassword:{
        type:String,
        require:[true,"Confirm Password Field is Empty"],
        validate:{
            validator:function(el){
                console.log("oasssword :",el);
                return el===this.password
            },
            message:"Password mismatched"
        }
    },
    avatar:{type:String},
    status:{type:String},
    friendlist:[
        {
        type:Mongoose.Schema.Types.ObjectId,
        ref:"Users",
        }
    ],
    created_At:{
        type:Date,
        default:Date.now()
    },
    active:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        enum:["participant","admin","me"],
        default:"participant"  
    },
    passwordChangedAt:Date,
    passswordResetToken:String,
    passwordResetExpires:Date,
});
usersSchema.pre('save',async function(next){
    this.password=await bcrypt.hash(this.password,12);
   
    this.confirmpassword="";
    next();
});

usersSchema.methods.correctPassword = async function(candidatePassword,password) {
    try {
      return await bcrypt.compare(candidatePassword, password);
    } catch (error) {
      throw new Error(error);
    }
  };
// usersSchema.methods.correctPassword=async function(candidatePassword,userPassword){
//         return await bcrypt.compare(candidatePassword,userPassword);
//       };
 usersSchema.methods.resetPassword=function(){
    const reset=crypto.randomBytes(32).toString('hex');
    this.passswordResetToken=crypto.createHash('sha256').update(reset).digest('hex');
    this.passwordResetExpires=date.now()+10*60*1000
    return reset;
 }
const Users=Mongoose.model("Users",usersSchema);

    
module.exports=Users; 