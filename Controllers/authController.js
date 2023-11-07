const Users=require("./../Models/users");
const jwt=require('jsonwebtoken');
const crypt=require('crypto');
const sendEmail=require('./../utils/sendEmail');
function generateToken(id){
      let option={
        expiresIn:'1h'
      }
      
      token=jwt.sign({id:id},process.env.SECRET,{expiresIn: '2000s'});
      return token;
}
exports.login=async(req,res)=>{
    let token=null;
    const {email,candidatePassword}=req.body;
    let user=await Users.findOne({email}).select("+password");
   // console.log(await Users.correctPassword(candidatePassword,user.password));   ///////
     if(!user )//|| !Users.correctPassword(candidatePassword,user.password))
     {
         res.status(200).json({status:"Fail",message:"Email or Password is Wrong"});
        return;
        }
    token=generateToken(user.id);
    res.cookie("jwt",token,{secure:true});
    res.status(200).json({status:"success",result:{token,user}})
};
exports.signup=async(req,res)=>{
    const {fullname,email,password,confirmpassword}=req.body;
    const data=await Users.create({fullname,email,password,confirmpassword});
    token=generateToken(data.id);
    res.cookie("jwt",token,{secure:true});
        res.status(201).json({status:"success",result:{
            token,
            data
        }});
    
};

exports.protect=async(req,res,next)=>{
    try{
        
        if(!req.cookie || !req.cookies.jwt){
            res.status(200).json({status:"failed",message:"unauthorised"});
        }
        token=req.cookie.jwt;
        const decoded=await jwt.verify(token,process.env.SECRET);
        console.log({decoded});
        const fresherUser=await Users.findOne({_id:decoded.id});
    
        if(!fresherUser){
                res.status(200).json({token:"USERS NO LONGER EXIST"});
    
        }
        req.user=fresherUser;
        res.locals.users=fresherUser; 
    }
    catch(err){
        console.log("ERROR  :  ",err);
    } 
}
exports.restrictTo=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role))
            return res.status(200).json({token:"YOU DONT HAVE ACCESS"});
        next();
        }
}
exports.forgetPassword=async(req,res)=>{
    //1)GET User based on posted email
        const user=await Users.findOne({email:req.body.email});
        if(!user)
            res.status(200).json({"status":"fail",message:"Email not Exist"});
        
    //2)Genearte the random reset token
        const resetToken=await Users.resetPassword();
        
        //3)send it to user's email

        sendEmail({
            email:user.email,
            subject:"Password reset Token",
            message :"this is your password reset Token : " +resetToken
        });
        res.status(200).json({status:"success",resetTOken:resetToken});
}