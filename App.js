const Express = require('express');
const path = require('path');
const App = Express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoute');
const chatRouter = require('./Routes/ChatRoute');
const viewRouter = require('./Routes/viewRoute');
const meetingRoute = require('./Routes/meeting');
const fs=require('fs');
const https=require('https');
const key=fs.readFileSync(__dirname+"/create-cert-key.pem");
const cert=fs.readFileSync(__dirname+"/create-cert.pem");
const socket = require('socket.io');

const expressSession = require('express-session');
//SET VIEW ENGINE
App.use(cors());
App.use(morgan('dev'));
App.use(cookieParser());
App.use(Express.json());
App.use(Express.urlencoded({ extended: true }));
App.use('/', Express.static(path.join(__dirname, 'Public')));

App.set('view-engine', 'ejs');
App.set('views', path.join(__dirname, 'views')); 


const expressServer=https.createServer({key,cert},App);
expressServer.listen('7575',"192.168.1.11", () => {
    console.log('https://192.168.1.11:7575');
})
//App.use(bodyParser({extended:true}));
// const io=socket(App.listen("7575",()=>{console.log("http://192.168.1.11:7575")}));
const io =socket(expressServer);

App.use(
	expressSession({
		secret: 'knsdnakfnd',
		resave: false,
		saveUninitialized: false, 
	})
);
App.use('/users', userRouter);
App.use('/chats', chatRouter);
App.use('/', viewRouter);
App.use('/meeting', meetingRoute);
App.all('*', (req, res) => {
	res.status(404).render('404page.ejs');
});

let users=0;
let roomObj={};

const offers=[
    // offererUserName,
    // offer,
    // offerIceCandidate,
    // AnsererUsername,
    // answer,
    // answererIceCandidate,
];
const socketSet=[];

io.on("connection",(socket)=>{
	const {userName}=socket.handshake.auth;
    console.log(userName + "     " +socket.id);
	socket.on("addSocketIDs",(rooms)=>{
        
        socketSet.forEach(socketId=>{
                if(socketId.socketId[0]==rooms[1]){
                    rooms=socketId;
                }
        });
        socketSet.push({userName,socketId:rooms});

    });
    if(offers.length){
        socket.to(socketSet[0].socketId).emit("existedOffers",offers);
    }
    socket.on('newbtnvisible',(_)=>{
        socketSet.forEach(El=>{
            if(El.userName==userName){
                socket.to(El.socketId).emit('showEndCallbtn',true);
            }
        })
    })
    socket.on('newAnswer',(offerObj,ackFunction)=>{
        const socketToAnswer=socketSet.find(users=>users.userName===offerObj.offererUserName);
        if(socketToAnswer){
            const socketIDToAnswer=socketToAnswer.socketId;
			console.log(socketIDToAnswer);
            if(socketIDToAnswer){
                const offerToUpdate=offers.find(offer=>offer.offererUserName===offerObj.offererUserName);
                if(offerToUpdate){
                    ackFunction(offerToUpdate.offerIceCandidate);
                    offerToUpdate.answer=offerObj.answer;
                    offerToUpdate.AnsererUsername=userName;
                    socket.to(socketSet[0].socketId).emit('callingResponse',offerToUpdate);
                }
            }
        }
    });
    socket.on("newOffer",({offer,communicationType})=>{
        offers.push({
            offererUserName:userName,
            offer:offer,
            offerIceCandidate:[],
            AnsererUsername:null,
            answer:null,
            answererIceCandidate:[],
            communicationType
        })
        socket.to(socketSet[0].socketId).emit("newOfferAwaiting",offers.slice(-1));
    });
    socket.on('addIceCandidates',(IceCandidate)=>{
     const {iceUserName,didIOffer,iceCandidate}=IceCandidate;
     if(didIOffer){
      const offerObj=  offers.find(Offer=>Offer.offererUserName===iceUserName);
      if(offerObj){
      //console.log(iceCandidate);
        offerObj.offerIceCandidate.push(iceCandidate);
        const offerInOffeers=offers.find(o=>o.AnsererUsername===iceUserName); 
        if(offerObj.AnsererUsername){
            console.log(offerInOffeers);
            //pass it through to the other socket
            if(!offerInOffeers)
                return ;
                const socketTosendTo=socketSet.find(s=>s.userName===offerInOffeers.AnsererUsername);
            if(socketTosendTo){
                socket.to(socketTosendTo.socketId).emit('recivedIceCandidateFromServer',iceCandidate);
            }else{
                console.log("ICE Candidate received but could not find answer");
            }
        }
  
                }
        }else{
            const offerInOffeers=offers.find(o=>o.AnsererUsername===iceUserName);
            const socketTosendTo=socketSet.find(s=>s.userName===offerInOffeers.offererUserName);
            if(socketTosendTo){
                socket.to(socketTosendTo.socketId).emit('recivedIceCandidateFromServer',iceCandidate);
            }else{
                console.log("ICE Candidate received but could not find offer");
            }
        }
    });
  	socket.on('ping', () => {
		const currTime = Date.now();
		socket.emit('pong', currTime);
	  });
    socket.on("join-room",async (data)=>{
        roomObj=await data; 
        socket.join(roomObj.roomId);
        users++;       
      });

    socket.on("disconnect",()=>{console.log("disconnected")});
    socket.on('send-message',({message,senderId,user,type})=>{
           // const rooms = io.sockets.adapter.rooms;
         socket.to(roomObj.roomId).except(senderId).emit('receive-message',{message,user,type});

    });
});
module.exports = { App };
 
  