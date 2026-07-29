// ======================================
// ELEMENTS
// ======================================

const hero = document.querySelector(".hero");

const startBtn = document.getElementById("startBtn");

const closeSheet = document.getElementById("closeSheet");

const sheet = document.getElementById("rsvpSheet");

const form = document.getElementById("rsvpForm");

const steps = document.querySelectorAll(".step");

const nextButtons = document.querySelectorAll(".next-btn");

const progressFill = document.getElementById("progressFill");

const progressText = document.getElementById("progressText");

const optionCards = document.querySelectorAll(".option-card");

const attendanceInput = document.getElementById("attendance");

const guestInput = document.getElementById("guestNumber");

const plus = document.getElementById("plus");

const minus = document.getElementById("minus");

const guestCount = document.getElementById("guestCount");

const loadingScreen = document.getElementById("loadingScreen");

const successScreen = document.getElementById("successScreen");

const closeSuccess = document.getElementById("closeSuccess");

let currentStep = 0;

let guests = 1;

let attendance = "";

// ======================================
// GOOGLE APPS SCRIPT
// ======================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydtHm8X18YdMdZZMp-cYriMbCjD9664mPHt5JUYzBDIBxTA7e6EatPCPe7KXd2bMp7/exec";

// ======================================
// OPEN RSVP
// ======================================

startBtn.addEventListener("click", () => {

    sheet.classList.add("active");
 
    hero.classList.add("blur");

    setTimeout(() => {

        document.getElementById("name").focus();

    }, 400);

});


// ======================================
// CLOSE RSVP
// ======================================

closeSheet.addEventListener("click",()=>{

    sheet.classList.remove("active");

    hero.classList.remove("blur");

});



// ======================================
// SHOW STEP
// ======================================

function showStep(index){

    steps.forEach(step=>{

        step.classList.remove("active");

    });

    steps[index].classList.add("active");

    const header=document.querySelector(".sheet-header");

    if(index===0){

        header.classList.remove("hide");

    }else{

        header.classList.add("hide");

    }

    updateProgress();

}


// ======================================
// PROGRESS
// ======================================

function updateProgress(){

    const percent=((currentStep+1)/4)*100;

    progressFill.style.width=percent+"%";

    progressText.innerHTML=`STEP ${currentStep+1} OF 4`;

}


// ======================================
// ATTENDANCE
// ======================================

optionCards.forEach(card=>{

    card.addEventListener("click",()=>{

        optionCards.forEach(c=>{

            c.classList.remove("active");

        });

        card.classList.add("active");

        attendance=card.dataset.value;

        attendanceInput.value=attendance;

    });

});


// ======================================
// GUESTS
// ======================================

function updateGuests(){

    guestCount.innerHTML=guests;

    guestInput.value=guests;

    document.querySelector(".guest-display small").innerHTML=

        guests===1

        ?"Guest"

        :"Guests";

}

plus.addEventListener("click",()=>{

    if(guests<20){

        guests++;

        updateGuests();

    }

});

minus.addEventListener("click",()=>{

    if(guests>1){

        guests--;

        updateGuests();

    }

});

updateGuests();




// ======================================
// NEXT BUTTONS
// ======================================

nextButtons.forEach(button => {

    button.addEventListener("click", () => {

        // --------------------------
        // STEP 1
        // --------------------------

        if (currentStep === 0) {

            const name = document.getElementById("name").value.trim();

            const mobile = document.getElementById("mobile").value.trim();

            if (name.length < 3) {

                alert("Please enter your full name.");

                return;

            }

            if (!/^[6-9]\d{9}$/.test(mobile)) {

                alert("Please enter a valid 10-digit mobile number.");

                return;

            }

        }


        // --------------------------
        // STEP 2
        // --------------------------

        if (currentStep === 1) {

            if (!attendance) {

                alert("Please select an option.");

                return;

            }

            // Skip Guest Count if user is not attending

            if (attendance === "No") {

                currentStep = 3;

                showStep(currentStep);

                return;

            }

        }

        currentStep++;

        showStep(currentStep);

    });

});








// ======================================
// COUNTDOWN
// ======================================

const weddingDate = new Date("2026-11-16T11:11:00");

function updateCountdown() {

    const now = new Date();

    const diff = weddingDate - now;

    if (diff <= 0) {

        return;

    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (diff % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (diff % (1000 * 60))
        / 1000
    );

    document.getElementById("days").textContent = days;

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}

updateCountdown();

setInterval(updateCountdown, 1000);


// ======================================
// SUBMIT RSVP
// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    loadingScreen.classList.add("show");

    const submitButton = document.querySelector(".submit-btn");

    submitButton.disabled = true;

    submitButton.innerHTML = "Submitting...";

    const payload = {

        name: document.getElementById("name").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        attendance: attendance,

        guests: attendance === "No" ? 0 : guests,

        message: document.getElementById("message").value.trim()

    };

    try {

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            redirect: "follow",

            body: JSON.stringify(payload),

            headers: {

                "Content-Type": "text/plain;charset=utf-8"

            }

        });

        const text = await response.text();

        console.log(text);

        loadingScreen.classList.remove("show");

        successScreen.classList.add("show");

    }

    catch (err) {

        console.error(err);

        loadingScreen.classList.remove("show");

        alert(err.message);

    }

    finally {

        submitButton.disabled = false;

        submitButton.innerHTML = "Submit RSVP ❤️";

    }

});

// ======================================
// SUCCESS SCREEN
// ======================================

function showSuccess() {

    loadingScreen.classList.remove("show");

    successScreen.classList.add("show");

}

closeSuccess.addEventListener("click", () => {

    successScreen.classList.remove("show");

    sheet.classList.remove("active");

    hero.classList.remove("blur");

    resetForm();

});


// ======================================
// RESET
// ======================================

function resetForm() {

    form.reset();

    guests = 1;

    attendance = "";

    guestInput.value = 1;

    attendanceInput.value = "";

    updateGuests();

    optionCards.forEach(card => {

        card.classList.remove("active");

    });

    currentStep = 0;

    showStep(0);

}


// ======================================
// CLOSE SUCCESS
// ======================================

closeSuccess.addEventListener("click", () => {

    successScreen.classList.remove("show");

    sheet.classList.remove("active");

    hero.classList.remove("blur");

    resetForm();

});

