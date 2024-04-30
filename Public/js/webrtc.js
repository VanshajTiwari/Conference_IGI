let localStream;
let remoteStream;
let PeerConnection;
let audioFlag=true;
let didIOffer=false;
const localVideoEl=document.querySelector("#local-video");
const remoteVideoEl=document.querySelector("#remote-video");
const EndCallerBtn=document.querySelector("#End-Caller-voice");
//DOM
let peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}
const audioEl=document.querySelector("#answerCall");
const remoteEl=document.querySelector("#calleranswer");
async function callAudio(){
    didIOffer=true;
    const communicationType=false;
    await fetchUserMedia(communicationType);
   // audioEl.srcObject=stream;let remoteStream;
    await createPeerConnection();
    const offer=await PeerConnection.createOffer();
    socket.emit("newOffer",{offer,communicationType});
    PeerConnection.setLocalDescription(offer);
    
}
async function callVideo(){
    didIOffer=true;
    const communicationType=true;
    await fetchUserMedia(true);
    await createPeerConnection("",true);
    const offer=await PeerConnection.createOffer();
    
    socket.emit("newOffer",{offer,communicationType});
    PeerConnection.setLocalDescription(offer);
   
}

async function addAnswer(offer,flag=false){
    ringtone.stop();
    await fetchUserMedia(flag);
    await createPeerConnection(offer,flag); 
    const answer=await PeerConnection.createAnswer({});
    await PeerConnection.setLocalDescription(answer);
   // console.log(offer);
    offer.answer=answer;
    const iceCandidates=await socket.emitWithAck('newAnswer',offer);
   // console.log(PeerConnection);
    iceCandidates.forEach(async ICE=>{ 
        await PeerConnection.addIceCandidate(ICE);;
        //console.log(ICE); 
    });
    // console.log("peerConnection"); 
    // console.log(PeerConnection);

    //callers.innerHTML="Connected";///////////////////////////////////////////////////////////////;
    callers.classList.add("hidden");
    EndCallerBtn.classList.remove("hidden");
    EndCallerBtn.addEventListener('click',EndCall);
    return;
}
async function addNewIceCandidate(ICE){
    await PeerConnection.addIceCandidate(ICE);
}
async function addCallRsponse(offerObj){
    console.log(offerObj.answer); 
    await PeerConnection.setRemoteDescription(offerObj.answer);
}
async function createPeerConnection(remoteOffer,flag=false){
 return new Promise((res,rej)=>{   PeerConnection=new RTCPeerConnection(peerConfiguration);
    remoteStream=new MediaStream();
    console.log(flag);
    if(flag){ 
        console.log(remoteStream);
        remoteVideoEl.srcObject=remoteStream;
    }
    else
        audioEl.srcObject=remoteStream;
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
} 
async function setAudioStream(){
    
}
async function fetchUserMedia(flag=false){
    return new Promise(async(res,rej)=>{
    try{const stream=await navigator.mediaDevices.getUserMedia({
            audio:audioFlag,
            video:flag 
        });  
        localStream=stream;
        if(flag){
            const mediaSTream=new MediaStream();
            mediaSTream.addTrack(localStream.getTracks().find(e=>e.kind=="video"),mediaSTream);
            localVideoEl.srcObject=mediaSTream;
        }
        res();}
    catch(err){ 
        console.log(err.message);
        rej();
    }
    })
 
}
async function EndCall(){
    await PeerConnection.close();
    PeerConnection=null;
    localStream=null;
    remoteStream=null;
    audioEl.srcObject=null;
    EndCallerBtn.classList.add("hidden");
    EndCallerBtn.removeEventListener("click",EndCall);
    callingbtn.classList.remove("hidden");
}
const callers=document.querySelector(".caller-answer");
callingbtn=document.querySelector(".call");
if(callingbtn)
callingbtn.addEventListener('click',(e)=>{
    document.querySelector(".caller-voice-span").innerHTML="Calling"
    e.target.closest(".call").style.backgroundColor="green";
    callAudio();});
const span01=document.querySelector("#callingbtn");
if(span01)
document.querySelector("#callingbtn").addEventListener("click",()=>{
    callVideo();
}) 