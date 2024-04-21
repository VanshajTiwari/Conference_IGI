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
    msgMaker("Vanshaj Tiwari",e.target[0].value);
    e.reset();
});


function addRemoteUser(){
    const div=document.createElement("div");
    div.className="bg-red-300 p-3 text-center rounded-lg m-3 w-[300px] h-[300px]"
    div.innerHTML=`
    <span class="text-2xl">Vanshaj Tiwari</span>
    <video src="" controls class="rounded-lg w-full h-[230px] "></video>
    `;
    
}