const meetingModel=require("./../Models/meeting");
const crypto=require('crypto');
const uuid=require('uuid');
const jwt=require('jsonwebtoken');
const secret="this is my private key for Scheduling meetings";
async function createToken(payload){
    return await jwt.sign(payload,secret);
}
exports.createMeeting=async(req,res)=>{

        const host=req.session.user;
        const meetingID=passwordGenerator();
        const password=passwordGenerator();
        const token=await createToken({meetingID,password});
        const startAt=new Date(req.body.date+" "+req.body.time).toISOString();
        // key
        const agenda=req.body.meeting_type;
        const meetingLink=`/meeting/projectIGI?token=${token}`
        const meetingObj=new meetingModel({createdBy:host,host:[host],meetingID,password,startAt,agenda,meetingLink});   
        meetingObj.save();     
        res.redirect('/dashboard/meeting');
}

exports.getMeetings=async(req,res)=>{
    res.direct("/dashboard");
}

function passwordGenerator(){
    return crypto.randomBytes(4).toString('hex');
}