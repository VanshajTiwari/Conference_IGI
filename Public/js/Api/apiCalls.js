const BASE_URL="https://127.0.0.1:7575"
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
const shareFile=async(formData)=>{
try{    const res=await axios({
        method:"POST",
        url:`${BASE_URL}/users/uploadfile`,
        data:formData,
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    });
    return res.data.data;}
catch(err){
    console.log("fileShared Error");
    console.log(err.message);
}
}