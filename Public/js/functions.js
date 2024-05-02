const goMenu=document.querySelectorAll(".menu--toggle--btn");
const navBar=document.querySelector(".nav-mover");
if(goMenu)
goMenu.forEach(e=>e.addEventListener("click",()=>{
    navBar.classList.toggle("-translate-x-80");
}));