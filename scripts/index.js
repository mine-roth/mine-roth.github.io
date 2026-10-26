const MRInfo = document.getElementById("MR");

function aboutMR(){
    MRInfo.setAttribute("show",true);
}

function closeMR() {
    MRInfo.setAttribute("show",false);
}

function signUp() {
    setTimeout(() => {
        window.location.href = "log.html?q=signup"
    }, 350);
}

function logIn() {
    setTimeout(() => {
        window.location.href = "log.html?q=login"
    }, 350);
}