const addFilebtn=document.querySelector('.file--00');
const fileLink=document.querySelector("#file--0");

fileLink.addEventListener('change',()=>{
    console.log(fileLink.files[0]);
})
addFilebtn.addEventListener('click',()=>{
        fileLink.click();
});

console.log(addFilebtn);
