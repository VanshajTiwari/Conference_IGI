console.log("Hello")

function hello(){
    const nav__links=document.querySelectorAll('.nav-element');

    nav__links.forEach(
            ele=>{
            console.log(ele);})
}


const nav__links=document.querySelectorAll('.nav-element');
nav__links.forEach(
        ele=>{
        
        ele.addEventListener("click",(e)=>{
            nav__links.forEach(e=>e.classList.remove('active'));
        
            e.target
            .closest(".nav-element")
            .classList.add("active");
        });
     

        }
                                );
