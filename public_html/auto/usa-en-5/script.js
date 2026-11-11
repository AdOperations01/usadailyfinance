const OFFER_URL = "https://globalvisitclub.com/cf/click/1";
document.querySelectorAll(".choice").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
    const status=btn.dataset.status;
    sessionStorage.setItem("insurance_status",status);
    // Add your approved Meta Pixel event here if needed.
    setTimeout(()=>{
      if(OFFER_URL && OFFER_URL.indexOf("http")===0){
        const sep=OFFER_URL.includes("?")?"&":"?";
        location.href=OFFER_URL+sep+"insurance_status="+encodeURIComponent(status);
      } else {
        console.log("Selected:",status);
      }
    },300);
  });
});