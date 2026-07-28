const weddingDate = new Date("November 16, 2026 11:11:00").getTime();

setInterval(() => {

const now = new Date().getTime();

const distance = weddingDate - now;

const days = Math.floor(distance / (1000 * 60 * 60 * 24));

const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

const seconds = Math.floor((distance % (1000 * 60)) / 1000);

document.getElementById("countdown").innerHTML = `

<div>

<h2>${days}</h2>

<p>Days</p>

</div>

<div>

<h2>${hours}</h2>

<p>Hours</p>

</div>

<div>

<h2>${minutes}</h2>

<p>Minutes</p>

</div>

<div>

<h2>${seconds}</h2>

<p>Seconds</p>

</div>

`;

},1000);

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydtHm8X18YdMdZZMp-cYriMbCjD9664mPHt5JUYzBDIBxTA7e6EatPCPe7KXd2bMp7/exec";

document.getElementById("rsvpForm").addEventListener("submit", function(e){

    e.preventDefault();

    const btn = document.getElementById("submitBtn");

    btn.innerHTML="Submitting...";
    btn.disabled=true;

    const data = {
        name:document.getElementById("name").value,
        mobile:document.getElementById("mobile").value,
        attend:document.getElementById("attend").value,
        guests:document.getElementById("guests").value,
        message:document.getElementById("message").value
    };

    fetch(SCRIPT_URL,{
        method:"POST",
        body:JSON.stringify(data),
        headers:{
            "Content-Type":"text/plain;charset=utf-8"
        }
    })
    .then(()=>{
       showPopup();

document.getElementById("rsvpForm").reset();

btn.innerHTML="Confirm RSVP ❤️";
btn.disabled=false;
    })
    .catch(()=>{
        alert("Something went wrong.");

        btn.innerHTML="Confirm RSVP ❤️";
        btn.disabled=false;
    });

});

function showPopup(){

    document
        .getElementById("successPopup")
        .classList.add("show");

    setTimeout(()=>{

        closePopup();

    },10000);
}

function closePopup(){

    document
        .getElementById("successPopup")
        .classList.remove("show");
}