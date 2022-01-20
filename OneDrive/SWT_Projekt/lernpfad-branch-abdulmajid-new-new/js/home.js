const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
// Display Mobile Menu
const mobileMenu = ()=>{
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
}
menu.addEventListener('click',mobileMenu);


let totop = document.getElementById("totopbutton");

totop.addEventListener('click',function(){

  window.scrollTo({
    top : 0,
    behavior :"smooth"
  });
});
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (document.body.scrollTop > 12 || document.documentElement.scrollTop > 12) {
    totop.style.display = "block";
  } else {
    totop.style.display = "none";
  }
}

const getStarted = document.querySelector(".get__started__button__container");
getStarted.addEventListener('click',function(){
  location.replace("../html/app.html")
})

