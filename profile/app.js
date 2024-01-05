import { getData, getLoggedInUser, updateData } from "../utilites/functions.mjs";

const profilePicture = document.getElementById('profilePicture');
const profilePicture2 = document.getElementById('profilePicture2');
const userName = document.getElementById('userName');
const desc = document.getElementById('desc');
const email = document.getElementById('email');
const pNumber = document.getElementById('pNumber');
const hobbies = document.getElementById('hobbies');

const userNameInput = document.getElementById('userNameInput');
const descInput = document.getElementById('descInput');
const emailInput = document.getElementById('emailInput');
const pNumberInput = document.getElementById('pNumberInput');
const hobbiesInput = document.getElementById('hobbiesInput');
const imageInput = document.getElementById('imageInput');
const updateBtn = document.getElementById('updateBtn');

let userDetails;
let uid;

const checkLogin = async () => {
  console.log("===>>> checking login user")
  const loggedInUser = await getLoggedInUser()
  if (loggedInUser) {
    console.log("===>>> user logged in", loggedInUser)
    uid = loggedInUser.uid

    // get user data from db
    const userData = await getData(loggedInUser.uid, "users")
    if (userData.status) {
      console.log("===>>> user data", userData.data)
      userDetails = userData.data
      //adding image in navbar
      profilePicture.src = userData.data.profilePicture || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"
      // adding image in dashboard
      profilePicture2.src = userData.data.profilePicture || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"
      // adding dashboard data
      userName.innerHTML = userData.data.userName || "No User Name"
      desc.innerHTML = userData.data.desc || "No Description"
      email.innerHTML = userData.data.email || "No Email"
      pNumber.innerHTML = userData.data.pNumber || "No Phone Number"
      hobbies.innerHTML = userData.data.hobbies || "No Hobbies"

      // adding modal data
      userNameInput.value = userData.data.userName || ""
      descInput.value = userData.data.desc || ""
      emailInput.value = userData.data.email || ""
      pNumberInput.value = userData.data.pNumber || ""
      hobbiesInput.value = userData.data.hobbies || ""
      imageInput.value = userData.data.profilePicture || ""

    } else {
      console.log("===>>> user data not found")
    }
  } else {
    console.log("===>>> user not logged in")
    window.location.href = "../index.html"
  }
}

checkLogin()


const updateProfile = async () => {
  console.log("working update profile")

  // creating data object to update in db
  const data = {
    userName: userNameInput.value,
    desc: descInput.value,
    email: emailInput.value,
    pNumber: pNumberInput.value,
    hobbies: hobbiesInput.value,
    profilePicture: imageInput.value
  }

  // update function from utils/functions.mjs
  const updateUser = await updateData(data, uid, "users")
  if (updateUser.status) {
    alert(updateUser.message)
    window.location.reload()
  } else {
    alert(updateUser.message)
  }
}
updateBtn.addEventListener('click', updateProfile)












// import {
//   auth,
//   db,
//   doc,
//   getDoc,
//   onAuthStateChanged,
//   setDoc,
//   signOut,
// } from "../utilites/app.js";

// import { getData, getLoggedInUser, updateData } from "../utils/functions.mjs";

// // DOM elements
// const userNameHtml = document.querySelector("#userName");
// const descHtml = document.querySelector("#desc");
// const emailHtml = document.querySelector("#email");
// const pNumberHtml = document.querySelector("#pNumber");
// const hobbiesHtml = document.querySelector("#hobbies");
// const profilePictureHtml = document.querySelector("#profilePicture");
// const logoutBtn = document.querySelector("#logoutBtn");
// const updateBtn = document.querySelector("#updateBtn");

// // Edit modal elements
// const userNameInput = document.querySelector("#userNameInput");
// const emailInput = document.querySelector("#emailInput");
// const phoneNumberInput = document.querySelector("#phoneNumberInput");
// const hobbiesInput = document.querySelector("#hobbiesInput");
// const imageInput = document.querySelector("#imageInput");
// const descriptionInput = document.querySelector("#descriptionInput");

// let uid;

// // Checking the authentication state of the user
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//       // If user is signed in
//       uid = user.uid;
//       const docRef = doc(db, "users", uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//           // If user document exists, update profile information
//           const { userName, email, desc, pNumber, hobbies, profileUrl, id } = docSnap.data();

//           userNameHtml.innerHTML = `${userName.slice(0, 1).toUpperCase()}${userName.slice(1).toLowerCase()}`;
//           descHtml.innerHTML = desc ? desc : "No Description Updated";
//           emailHtml.innerHTML = email ? email : "No Email Updated";
//           pNumberHtml.innerHTML = pNumber ? pNumber : "No Phone Number Updated";
//           hobbiesHtml.innerHTML = hobbies ? hobbies : "No hobbies Updated";
//           profilePictureHtml.src = profileUrl ? profileUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";

//           // Populate the edit modal inputs with existing data
//           userNameInput.value = userName ? userName : "";
//           emailInput.value = email ? email : "";
//           phoneNumberInput.value = pNumber ? pNumber : "";
//           hobbiesInput.value = hobbies ? hobbies : "";
//           imageInput.value = profileUrl ? profileUrl : "";
//           descriptionInput.value = desc ? desc : "";
//       } else {
//           console.log("No such document!");
//       }
//   } else {
//       // If user is signed out, redirect to login page
//       window.location.href = "../login/index.html";
//   }
// });

// // Function to handle updating user profile
// const updateProfileHandler = async () => {
//   const userObj = {
//       userName: userNameInput.value,
//       email: emailInput.value,
//       pNumber: phoneNumberInput.value,
//       hobbies: hobbiesInput.value.split(","),
//       profileUrl: imageInput.value,
//       desc: descriptionInput.value,
//       uid: uid,
//   };

//   // Display alert for update process
//   alert("Updating user profile...");

//   // Update the user profile in Firebase
//   await setDoc(doc(db, "users", uid), userObj);

//   // Display update success alert
//   alert("Profile updated successfully");
// };

// // Event listener for update button
// updateBtn.addEventListener("click", updateProfileHandler);

// // Function to handle user logout
// const logoutHandler = () => {
//   // Sign out user and redirect to login page
//   signOut(auth)
//       .then(() => {
//           window.location.href = "../login/index.html";
//       })
//       .catch((error) => {
//           console.log(error, "===>> error");
//       });
// };

// // Event listener for logout button
// logoutBtn.addEventListener("click", logoutHandler);