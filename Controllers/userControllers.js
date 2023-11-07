const Users=require('./../Models/users');

exports.getAllUsers=async(req,res)=>{
    const data=await Users.find();
    res.status(200).json({
        status:"Success",
        data
    });
};
exports.updateUser=async(req,res)=>{
    const {fullname,status}=req.body;
    const data=Users.findByIdAndUpdate(req.body.id,{fullname,status},{new:true});
    res.status(200).json({status:"success",data});
};

