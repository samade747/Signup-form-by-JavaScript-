// Import necessary functions from the Firebase SDK
// import { signUp, login, addInDBById, getLoggedInUser, getData, updateData, checkLogin } from "../utilites/functions.mjs";

import { signUp, login, addInDBById, getLoggedInUser } from "../utilites/functions.mjs";

const email = document.getElementById('email');
const password = document.getElementById('password');
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

let userDetails;
let uid;

const checkLogin = async () => {
  console.log("===>>> checking login user")
  const loggedInUser = await getLoggedInUser()
  if (loggedInUser) {
    console.log("===>>> user logged in", loggedInUser)
    uid = loggedInUser.uid
    window.location.href = "../home/index.html"
  } else {
    window.location.href = "../login/index.html"
  }

}


let checkLoginCalled = false;


const loginUp = async () => {
  event.preventDefault();
  console.log(email, password)

  if (!email.value || !password.value) {
    Swal.fire({
      icon: "error",
      title: "Required...",
      text: "Please fill in both email and password!",
    });
    return;
  } else if (password.value.length < 8) {
    Swal.fire({
      icon: "error",
      title: "Password...",
      text: "Password should be at least 8 characters long!",
    });
    return;
  }

  const logging = await login(email.value, password.value)
  if(logging.status) {
    alert(logging.message)
    window.location.href = './home/index.html'
  } else {
    alert(logging.message)
  }
}




loginSubmitBtn.addEventListener("click", loginUp);


if (!checkLoginCalled) {
  checkLogin();
  checkLoginCalled = true; 
}