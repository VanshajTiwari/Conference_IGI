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
            from:'Vanshaj tiwari <vanshajtiwari62gmail.com>',
            to:options.email,
            subject:options.subject,
            text:options.message,
           // html:
    }
    await transporter.sendMail(mailOption);
};
const getVerified=async(options)=>{
    console.log(options.data);
    const transporter=nodeMailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
         auth:{
             user:process.env.EMAIL_USERNAME,
             pass:process.env.EMAIL_PASSWORD
         }
        });
    const mailOption={
            from:'Vanshaj tiwari <vanshajtiwari62gmail.com>',
            to:options.data.email,
            subject:options.subject,
            text:options.message,
            html:`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>not vERIFIED</title>
              <style>
                    .div--0{
                        display: flex;
                        flex-direction: column;
                    }
                </style>
            </head>
            <body style="width:100vw;height:100vh;display: flex; justify-content: center;align-items: center;">
                    <div style="display: flex;width:900px;height: 200px;">
                        <div style="width: 200px;display:flex;flex-direction: column;justify-content: center;background-color: black;border-radius: 100%;overflow: hidden; margin-right: 30px;">
                            <div style="width: 100%; height: 100%;" class="tenor-gif-embed" data-postid="18901058" data-share-method="host" data-aspect-ratio="1.33333" data-width=""></div>
                                 <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
                        </div>
                        <div class="div--0 flex flex-col">
                            <h1 style="font-size: 25px;font-weight: bold;"> Candidate Info. </h1>
                            <div>
                                <span style="font-weight: bold;">Name: </span>
                                <span>${options.data.fullname}</span>
                            </div>
                            <div>
                                <span style="font-weight: bold;">Institution: </span>
                                <span>${options.data.InstitutionDetails[0].institution}</span>
                            </div>                
                            <div>
                                <span style="font-weight: bold;">Address: </span>
                                <span>${options.data.InstitutionDetails[0].InstitutionAddress}</span>
                            </div>                
                            <div>
                                <span style="font-weight: bold;">Mobile: </span>
                                <span>${options.data.InstitutionDetails[0].mobile}</span>
                            </div>                
                            <div>
                                <span style="font-weight: bold;">Email: </span>
                                <span>${options.data.email}</span>
                            </div>
                            <div>
                                <span style="font-weight: bold;">EmployID:</span>
                                <span>${options.data.InstitutionDetails[0].employID}</span>
                            </div>
                            <div>
                                <span style="font-weight: bold;">Employ Address:</span>
                                <span>${options.data.InstitutionDetails[0].userAddress}</span>
                            </div>
                            <a href="${options.url}/users/api/v1/approve/${options.data.id}" style="background-color: blue;color: white; padding: 2px;font-size: 20px;text-decoration: none;width: 100px;text-align: center;border-radius: 10px;margin-top:10px">Approve</a>
                        </div>
                    </div>
            </body>
            </html>`
    }
    await transporter.sendMail(mailOption);
};
module.exports={sendMail,getVerified};