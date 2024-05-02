let localStream;
let remoteStream;
let PeerConnection;
let audioFlag=true;
let didIOffer=false;

const localVideoEl=document.querySelector("#videoMeetingEl");
const remoteUsers=document.querySelector(".other-video");
function addCandidate(user,socketID){
    const El=document.createElement('div');
    El.id=socketID;
    El.className="bg-white p-3  text-center rounded-lg m-3 w-[300px] h-[300px]";
    const template=()=>`
    <span class="text-2xl">${user}</span>
    <video src="" controls class="rounded-lg w-full h-[230px] "></video>
    `
    El.innerHTML=template(user);
    remoteUsers.appendChild(El);
    return;
}
function cleanCandidate(){
    return;
}
function peerConfiguration(){
    return {
        iceServers:[
            {
                urls:[
                  'stun:stun.l.google.com:19302',
                  'stun:stun1.l.google.com:19302'
                ]
            }
        ]
    }
}

function msgMaker(user,msg){
    const div=document.createElement("div");
    div.className="m-3 float-right clear-both";
    div.innerHTML=`
    <span class="flex justify-end mr-2">${user}</span>
    <div class="bg-red-300 p-3 rounded-lg">${msg}</div>
    <span class="text-[12px] float-right text-gray-500">${(new Date()).toLocaleTimeString()}</span>

    `;
    document.querySelector(".video-chats--box").appendChild(div);
}
const videoCalling=document.querySelector(".video-calling-msgbox-form");
videoCalling.addEventListener("submit",(e)=>{
    e.preventDefault();
    msgMaker(userNameForMeeting,e.target[0].value);
    meetingNameSpace.emit("sendMsgInMeeting",{roomName,msg:e.target[0].value});

    e.target[0].value="";
});




//sockets



async function fetchUserMedia(){
    return new Promise(async (res,rej)=>{
        try{
            const stream=await navigator.mediaDevices.getUserMedia({
                audio:true,
                video:true
            });
            const medi=new MediaStream();
            medi.addTrack(stream.getTracks().find(e=>e.kind=='video'),medi);
            localStream=medi;
            localVideoEl.srcObject=localStream;
            res();
        }
        catch(err){
            console.log(err.message);
            rej();
        }
    });
};
async function leaveMeeting(){
    await PeerConnection.close();
    PeerConnection=null;
    remoteStream=null;
}
async function callVideo(){
    didIOffer=true;
    await fetchUserMedia();
    await createPeerConnection();
    const offer=await PeerConnection.createOffer();
    
}
async function createPeerConnection(remoteOffer){
    return new Promise((res,rej)=>{   PeerConnection=new RTCPeerConnection(peerConfiguration);
       remoteStream=new MediaStream();
    //    remoteVideoEl.srcObject=remoteStream;
       localStream.getTracks().forEach(track=>{
           PeerConnection.addTrack(track,localStream);
       });
       PeerConnection.addEventListener('icecandidate',(e)=>{
          // console.log("ICE");
          // console.log(e);
          if(e.candidate)
           socket.emit("addIceCandidates",{
               iceUserName:userName,
               iceCandidate:e.candidate
               ,didIOffer
           });
       });
       PeerConnection.addEventListener('track',(e)=>{
           console.log("new Tracks");
           e.streams[0].getTracks().forEach(El=>{
               remoteStream.addTrack(El,remoteStream); 
           });
           callingbtn.classList.add("hidden");
           EndCallerBtn.classList.remove("hidden");
           // EndCallerBtn.classList.add("hidden");////////////////////////////////////////////////////////////////
           EndCallerBtn.addEventListener("click",EndCall);
           // socket.emit('endbtnvisible',"");
       }) 
       if(remoteOffer){
           PeerConnection.setRemoteDescription(remoteOffer.offer);
       }res(); });
   };
   callVideo();


//sockets
meetingNameSpace.on("receive-message-in-meeting",({msg,ComUser})=>{
    msgMaker(ComUser,msg);
});
meetingNameSpace.on("newUser",(data)=>{
    remoteUsers.innerHTML="";
    for(let i of data){
        if(i.ComUser!=ComUser)
        addCandidate(i.ComUser,i.id);
    }
    meetingNameSpace.emit("pattha","");
})
meetingNameSpace.emit("addCandidates","");