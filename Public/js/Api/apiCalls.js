const BASE_URL="http://127.0.0.1:7575"
const getMessage=async(sender,receiver)=>{
    const res=await axios({
        method:"GET",
        url:`${BASE_URL}/chats/showmsg?send=${sender}&receiver=${receiver}`
    });

    return res.data.chats;
}   
const sendMsg=async(sender,message,receiver="")=>{
    const res=await axios({
        method:"POST",
        url:`${BASE_URL}/chats/sendmsg/${receiver}`,
        data:{sender,message}
    });
    
    return res;
}