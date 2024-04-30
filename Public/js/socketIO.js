const ringtone=document.querySelector(".ringtone-set");
if(ringtone)
ringtone.addEventListener("click",(e)=>{
    e.target.play();
})
voiceSpan=document.querySelector(".caller-voice-span");
// socket.on("existedOffers",(offerObj)=>{
//     console.log(offerObj);
//     if(offerObj.offererUserName!=userName)    
//         createCallerEl(offerObj);
// });
socket.on("callingResponse",(offerObj)=>{
    addCallRsponse(offerObj);
});
socket.on("newOfferAwaiting",(offerObj)=>{
    if(offerObj.offererUserName!=userName)    
        createCallerEl(offerObj);
    // callingbtn.style.display="none";
})
// socket.on("showEndCallbtn",()=>{
//     const answerbtn=document.querySelector(".caller-answer");
//     const endCallbtn=document.createElement('button');
//     endCallbtn.className="End-Call bg-red-400 text-white rounded-full px-3 mx-2";
//     endCallbtn.id="kill-existed-offer";
//     endCallbtn.innerHTML=`
//     <i class="fa-solid fa-phone text-[20px] m-4"></i>
//     <span class="font-bold caller-voice-span">End Call  hello</span>`;
//     callingbtn.append(endCallbtn);
//     callingbtn.style.display="none";
//     endCallbtn.addEventListener('click',EndCall);
//     answerbtn.style.display=none;
//     callingbtn.innerHTML="Call";
// });
socket.on('recivedIceCandidateFromServer',iceCandidate=>{
    addNewIceCandidate(iceCandidate);
});
function createCallerEl(offers){
    ringtone.click();
    callers.style.display="block";
    callingbtn.style.display="none";
    offers.forEach(offer=>{
        callers.addEventListener('click',()=>{
            if(offer.communicationType){
                videoWrapper.classList.toggle("hidden");
                indoxBoard.classList.toggle("hidden");
            callers.classList.add("hidden");addAnswer(offer,true); 
            return;
            }
            callers.classList.add("hidden");addAnswer(offer)}); 
    });
};

