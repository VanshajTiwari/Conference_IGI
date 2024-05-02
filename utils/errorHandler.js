module.exports=catchAsync=fn=>{
    return (req,res,next)=>
    fn(req,res,next).catch(err=>res.json({status:"fail",error:err.message}));
};