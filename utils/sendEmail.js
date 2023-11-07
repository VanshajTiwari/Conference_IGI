const nodeMailer=require('nodemailer');

const sendMail=async(options)=>{
    const transporter=nodeMailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
         auth:{
             user:process.env.EMAIL_USERNAME,
             pass:process.env.EMAIL_PASSWORD
         }
        });
    const mailOption={
            from:'Vanshaj tiwari vanshajtiwari6',
            to:options.email,
            subject:options.subject,
            text:options.message,
           // html:
    }
    await transporter.sendMail(mailOption);
};
module.exports=sendMail;