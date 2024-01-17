const BASE_URL="https://project-igi-chatting-application.onrender.com"
const getMessage=async()=>{
    const res=await axios({
        method:"GET",
        url:`${BASE_URL}/chats/showmsg`
    });

    return res.data.chats;
}   
const sendMsg=async(sender,message)=>{
    console.log(sender);
    const res=await axios({
        method:"POST",
        url:`${BASE_URL}/chats/sendmsg`,
        data:{sender,message}
    });
    
    return res;
}  
