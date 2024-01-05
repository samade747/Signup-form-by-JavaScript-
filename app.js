// Importing necessary modules from utilities/app.js
import {
  signUp,
  addInDBById
} from "../utilites/functions.mjs"; 

import { auth, onAuthStateChanged } from "./utilites/app.js";

// Selecting form elements
const name = document.getElementById('Name');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const cPassword = document.getElementById('cPassword');
const signupSubmitBtn = document.getElementById("signupSubmitBtn");




// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ... 
//   }
// });

// // Firebase authentication state change listener
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     // User is logged in
//     const uid = user.uid;
//     console.log(uid, "==>> uid");
//     alert("User is logged in");

//     // Check if user data is available in Firestore
//     const docRef = doc(db, "users", uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       console.log("Document data:", docSnap.data());
//       alert("User data is available");
//     } else {
//       console.log("No such document!");
//     }

//   } else {
//     // User is signed out
//     alert("User signed out");
//   }
// });
// Signup form submit handler



const signupHandler = async () => {
  // Prevent form submission
  event.preventDefault();

  // Validating form fields
  if (!userName.value || !email.value || !password.value || !cPassword.value) {
    // Show error message with Swal
    Swal.fire({
      icon: "error",
      title: "Required...",
      text: "Please fill all fields carefully!",
    });
    return;
  } else {
    // Checking password length
    if (password.value.length < 8) {
      // Show error message with Swal
      Swal.fire({
        icon: "error",
        title: "Password...",
        text: "Password should be at least 8 characters long!",
      });
      return;
    } else {
      // Checking if passwords match
      if (password.value !== cPassword.value) {
        // Show error message with Swal
        Swal.fire({
          icon: "error",
          title: "Password...",
          text: "Passwords do not match!",
        });
        return;
      }
    }
  }

  const data = {
    name: name.value,
    email: email.value,
    userName: userName.value,
    password: password.value,
  };

  // Call the signUp function from utilities
  const registering = signUp(email.value, password.value);

  if (registering.status) {
    try {
      // Add user data to Firestore
      const userAddInDB = await addInDBById(data, registering.data.user.uid, 'users');

      if (userAddInDB.status) {
        // Show success message with Swal
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User registered successfully!",
        }).then(() => {
          // Redirect to the home page
          window.location.href = './path/to/homepage.html';
        });
      } else {
        // Show error message with Swal
        Swal.fire({
          icon: "error",
          title: "Error",
          text: userAddInDB.message,
        });
      }
    } catch (error) {
      // Handle any additional errors
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while registering the user.",
      });
    }
  } else {
    // Show error message with Swal
    Swal.fire({
      icon: "error",
      title: "Error",
      text: registering.message,
    });
  }
};

// Event listener for signup button click
signupSubmitBtn.addEventListener('click', signupHandler);
