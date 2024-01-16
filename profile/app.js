// Importing logout function, assuming it is defined in your utility file
import { getData, getLoggedInUser, updateData, logout } from "../utilites/functions.mjs";

// Default profile picture URL
const defaultProfilePicture = "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg";

// DOM elements
const profilePicture = document.getElementById('profilePicture');
const profilePicture2 = document.getElementById('profilePicture2');
const userName = document.getElementById('userName');
const desc = document.getElementById('desc');
const email = document.getElementById('email');
const pNumber = document.getElementById('pNumber');
const hobbies = document.getElementById('hobbies');
const logoutBtn = document.getElementById('logoutBtn');

const userNameInput = document.getElementById('userNameInput');
const descInput = document.getElementById('descInput');
const emailInput = document.getElementById('emailInput');
const pNumberInput = document.getElementById('pNumberInput');
const hobbiesInput = document.getElementById('hobbiesInput');
const imageInput = document.getElementById('imageInput');
const updateBtn = document.getElementById('updateBtn');

let userDetails;
let uid;

// Function to set user data in the UI
const setUserDataInUI = (userData) => {
  profilePicture.src = userData.profilePicture || defaultProfilePicture;
  profilePicture2.src = userData.profilePicture || defaultProfilePicture;
  userName.innerHTML = userData.userName || "No User Name";
  desc.innerHTML = userData.desc || "No Description";
  email.innerHTML = userData.email || "No Email";
  pNumber.innerHTML = userData.pNumber || "No Phone Number";
  hobbies.innerHTML = userData.hobbies || "No Hobbies";
  userNameInput.value = userData.userName || "";
  descInput.value = userData.desc || "";
  emailInput.value = userData.email || "";
  pNumberInput.value = userData.pNumber || "";
  hobbiesInput.value = userData.hobbies || "";
  imageInput.value = userData.profilePicture || "";
};

// Function to check user login status
const checkLogin = async () => {
  console.log("===>>> checking login user");
  const loggedInUser = await getLoggedInUser();
  if (loggedInUser) {
    console.log("===>>> user logged in", loggedInUser);
    uid = loggedInUser.uid;

    // get user data from db
    const userData = await getData(loggedInUser.uid, "users");
    if (userData.status) {
      console.log("===>>> user data", userData.data);
      userDetails = userData.data;
      setUserDataInUI(userDetails);
    } else {
      console.log("===>>> user data not found");
    }
  } else {
    console.log("===>>> user not logged in");
    window.location.href = "../index.html";
  }
};

checkLogin();

// Function to update user profile
const updateProfile = async () => {
  console.log("working update profile");

  // creating data object to update in db
  const data = {
    userName: userNameInput.value,
    desc: descInput.value,
    email: emailInput.value,
    pNumber: pNumberInput.value,
    hobbies: hobbiesInput.value,
    profilePicture: imageInput.value
  };

  // update function from utils/functions.mjs
  const updateUser = await updateData(data, uid, "users");
  if (updateUser.status) {
    alert(updateUser.message);
    window.location.reload();
  } else {
    alert(updateUser.message);
  }
};

// Function to handle logout
const logoutbtnHandler = async () => {
  const logoutStatus = await logout();
  if (logoutStatus.status) {
    window.location.href = '../index.html';
  } else {
    console.log('logout failed, please try again');
  }
};

logoutBtn.addEventListener('click', logoutbtnHandler);
updateBtn.addEventListener('click', updateProfile);




// import { getData, getLoggedInUser, updateData } from "../utilites/functions.mjs";

// const profilePicture = document.getElementById('profilePicture');
// const profilePicture2 = document.getElementById('profilePicture2');
// const userName = document.getElementById('userName');
// const desc = document.getElementById('desc');
// const email = document.getElementById('email');
// const pNumber = document.getElementById('pNumber');
// const hobbies = document.getElementById('hobbies');
// const logoutBtn = document.getElementById('logoutBtn');

// const userNameInput = document.getElementById('userNameInput');
// const descInput = document.getElementById('descInput');
// const emailInput = document.getElementById('emailInput');
// const pNumberInput = document.getElementById('pNumberInput');
// const hobbiesInput = document.getElementById('hobbiesInput');
// const imageInput = document.getElementById('imageInput');
// const updateBtn = document.getElementById('updateBtn');



// let userDetails;
// let uid;

// const checkLogin = async () => {
//   console.log("===>>> checking login user")
//   const loggedInUser = await getLoggedInUser()
//   if (loggedInUser) {
//     console.log("===>>> user logged in", loggedInUser)
//     uid = loggedInUser.uid

//     // get user data from db
//     const userData = await getData(loggedInUser.uid, "users")
//     if (userData.status) {
//       console.log("===>>> user data", userData.data)
//       userDetails = userData.data
//       //adding image in navbar
//       profilePicture.src = userData.data.profilePicture || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"
//       // adding image in dashboard
//       profilePicture2.src = userData.data.profilePicture || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"
//       // adding dashboard data
//       userName.innerHTML = userData.data.userName || "No User Name"
//       desc.innerHTML = userData.data.desc || "No Description"
//       email.innerHTML = userData.data.email || "No Email"
//       pNumber.innerHTML = userData.data.pNumber || "No Phone Number"
//       hobbies.innerHTML = userData.data.hobbies || "No Hobbies"

//       // adding modal data
//       userNameInput.value = userData.data.userName || ""
//       descInput.value = userData.data.desc || ""
//       emailInput.value = userData.data.email || ""
//       pNumberInput.value = userData.data.pNumber || ""
//       hobbiesInput.value = userData.data.hobbies || ""
//       imageInput.value = userData.data.profilePicture || ""

//     } else {
//       console.log("===>>> user data not found")
//     }
//   } else {
//     console.log("===>>> user not logged in")
//     window.location.href = "../index.html"
//   }
// }

// checkLogin()


// const updateProfile = async () => {
//   console.log("working update profile")

//   // creating data object to update in db
//   const data = {
//     userName: userNameInput.value,
//     desc: descInput.value,
//     email: emailInput.value,
//     pNumber: pNumberInput.value,
//     hobbies: hobbiesInput.value,
//     profilePicture: imageInput.value
//   }

//   // update function from utils/functions.mjs
//   const updateUser = await updateData(data, uid, "users")
//   if (updateUser.status) {
//     alert(updateUser.message)
//     window.location.reload()
//   } else {
//     alert(updateUser.message)
//   }
// }

// const logoutbtnHanlder = async () =>{

//   const logoutStatus = await logout()
//   if(logoutStatus.status){
//     window.location.href = '../index.html'
//   } else {
//     console.log('login failed please try again')
//   }
// }













// logoutBtn.addEventListener('click', logoutbtnHanlder);



// updateBtn.addEventListener('click', updateProfile)








