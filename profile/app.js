import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  setDoc,
  signOut,
} from "../utilites/app.js";

// DOM elements
const userNameHtml = document.querySelector("#userName");
const descHtml = document.querySelector("#desc");
const emailHtml = document.querySelector("#email");
const pNumberHtml = document.querySelector("#pNumber");
const hobbiesHtml = document.querySelector("#hobbies");
const profilePictureHtml = document.querySelector("#profilePicture");
const logoutBtn = document.querySelector("#logoutBtn");
const updateBtn = document.querySelector("#updateBtn");

// Edit modal elements
const userNameInput = document.querySelector("#userNameInput");
const emailInput = document.querySelector("#emailInput");
const phoneNumberInput = document.querySelector("#phoneNumberInput");
const hobbiesInput = document.querySelector("#hobbiesInput");
const imageInput = document.querySelector("#imageInput");
const descriptionInput = document.querySelector("#descriptionInput");

let uid;

// Checking the authentication state of the user
onAuthStateChanged(auth, async (user) => {
  if (user) {
      // If user is signed in
      uid = user.uid;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
          // If user document exists, update profile information
          const { userName, email, desc, pNumber, hobbies, profileUrl, id } = docSnap.data();

          userNameHtml.innerHTML = `${userName.slice(0, 1).toUpperCase()}${userName.slice(1).toLowerCase()}`;
          descHtml.innerHTML = desc ? desc : "No Description Updated";
          emailHtml.innerHTML = email ? email : "No Email Updated";
          pNumberHtml.innerHTML = pNumber ? pNumber : "No Phone Number Updated";
          hobbiesHtml.innerHTML = hobbies ? hobbies : "No hobbies Updated";
          profilePictureHtml.src = profileUrl ? profileUrl : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";

          // Populate the edit modal inputs with existing data
          userNameInput.value = userName ? userName : "";
          emailInput.value = email ? email : "";
          phoneNumberInput.value = pNumber ? pNumber : "";
          hobbiesInput.value = hobbies ? hobbies : "";
          imageInput.value = profileUrl ? profileUrl : "";
          descriptionInput.value = desc ? desc : "";
      } else {
          console.log("No such document!");
      }
  } else {
      // If user is signed out, redirect to login page
      window.location.href = "../login/index.html";
  }
});

// Function to handle updating user profile
const updateProfileHandler = async () => {
  const userObj = {
      userName: userNameInput.value,
      email: emailInput.value,
      pNumber: phoneNumberInput.value,
      hobbies: hobbiesInput.value.split(","),
      profileUrl: imageInput.value,
      desc: descriptionInput.value,
      uid: uid,
  };

  // Display alert for update process
  alert("Updating user profile...");

  // Update the user profile in Firebase
  await setDoc(doc(db, "users", uid), userObj);

  // Display update success alert
  alert("Profile updated successfully");
};

// Event listener for update button
updateBtn.addEventListener("click", updateProfileHandler);

// Function to handle user logout
const logoutHandler = () => {
  // Sign out user and redirect to login page
  signOut(auth)
      .then(() => {
          window.location.href = "../login/index.html";
      })
      .catch((error) => {
          console.log(error, "===>> error");
      });
};

// Event listener for logout button
logoutBtn.addEventListener("click", logoutHandler);