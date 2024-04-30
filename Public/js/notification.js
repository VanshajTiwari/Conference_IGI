// console.log("notification loaded");
const notificationBox=document.querySelector(".message-notification-container");
function notificationTemplate(type,sender,msg){
  if(type=="text"){
    type="TEXT";
  }
  else{
    type="FILE";
  }
  return   `<span class="font-extrabold underline">${type}</span>
              <div class="flex">
              <div class="w-[50px] h-[50px] m-3 flex justify-center items-center rounded-full bg-red-400">
                <i class="fa-solid fa-paper-plane fa-shake text-[25px]"></i>
              </div>
              <div class="pr-2">
                  <div>
                    <h1 class="font-bold">${sender}</h1>
                  </div>
                  <p class="max-w-[200px]">${msg}</p>
              </div>
              </div>`;
};
function createNotification(type,user,msg){
  // console.log(notificationBox);
  const newNote=document.createElement("div");
  newNote.className="flex box flex-col bg-white duration-300 justify-center items-center notification p-2 border-2 float-right clear-both m-2 rounded-lg";
  newNote.innerHTML=notificationTemplate(type,user,msg);
  // console.log(newNote);
  notificationBox.appendChild(newNote);
  setTimeout(()=>{
    newNote.remove();
  },5000);

};
socket.emit("join-room-notifier",userName.userName);
socket.on("notification",({type,user,message})=>{
  // console.log("runned");
  createNotification(type,user,message);
});
