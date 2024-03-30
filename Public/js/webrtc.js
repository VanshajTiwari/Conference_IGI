let localStream;
let remoteStream;
let PeerConnection;
let didIOffer=false;

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
    await fetchUserMedia();
   // audioEl.srcObject=stream;let remoteStream;
    await createPeerConnection();
    const offer=await PeerConnection.createOffer();
    socket.emit("newOffer",offer);
    PeerConnection.setLocalDescription(offer);
    console.log(offer);
}
async function addAnswer(offer){
    
    await fetchUserMedia();
    await createPeerConnection(offer);
    const answer=await PeerConnection.createAnswer({});
    await PeerConnection.setLocalDescription(answer);
   // console.log(offer);
    offer.answer=answer;
    const iceCandidates=await socket.emitWithAck('newAnswer',offer);
   // console.log(PeerConnection);
    iceCandidates.forEach(async ICE=>{
        console.log(PeerConnection.signalingState);
        await PeerConnection.addIceCandidate(ICE);;
        //console.log(ICE);
    });
    console.log("peerConnection");
    console.log(PeerConnection);

    callers.innerHTML="Connected";
    return;
}
async function addNewIceCandidate(ICE){
    await PeerConnection.addIceCandidate(ICE);
}
async function addCallRsponse(offerObj){
    console.log(offerObj.answer); 
    await PeerConnection.setRemoteDescription(offerObj.answer);
}
async function createPeerConnection(remoteOffer){
 return new Promise((res,rej)=>{   PeerConnection=new RTCPeerConnection(peerConfiguration);
    remoteStream=new MediaStream();
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
        callingbtn.innerHTML="End Call";
        socket.emit('endbtnvisible',"");
    }) 
    if(remoteOffer){
        PeerConnection.setRemoteDescription(remoteOffer.offer);
    }res(); });
}
async function setAudioStream(){
    
}
async function fetchUserMedia(){
    return new Promise(async(res,rej)=>{
    try{const stream=await navigator.mediaDevices.getUserMedia({
            audio:true,
        });  
        console.log(stream);
        localStream=stream;
        res();}
    catch(err){
        console.log(err.message);
        rej();
    }
    })
 
}
async function EndCall(){
    await PeerConnection.close();
}
const callers=document.querySelector(".caller-answer");
callingbtn=document.querySelector(".call")
callingbtn.addEventListener('click',(e)=>{
    document.querySelector(".caller-voice-span").innerHTML="Calling"
    e.target.closest(".call").style.backgroundColor="green";
    callAudio();});
