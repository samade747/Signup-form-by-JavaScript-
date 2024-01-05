// Importing necessary modules from utilities/app.js
import {
  signUp,
} from "../utilites/functions.mjs"; 

import { auth, onAuthStateChanged } from "./utilites/app.js";

// Selecting form elements
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const cPassword = document.getElementById('cPassword');
const signupSubmitBtn = document.getElementById("signupSubmitBtn");


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ... 
  }
});

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
const signupHandler = async() => {
  // Validating form fields
  if (!userName.value || !email.value || !password.value || !cPassword.value) {
     Swal.fire({
      icon: "error",
      title: "Required...",
      text: "Please fill all fields carefully!",
      
    })
    return
  } else {
    // Checking password length
    if (password.value.length < 8) {
       Swal.fire({
        icon: "error",
        title: "Password...",
        text: "Password should be at least 8 characters long!",
        
      })
      return      
    } else {
      // Checking if passwords match
      if (password.value !== cPassword.value) {
         Swal.fire({
          icon: "error",
          title: "Password...",
          text: "Passwords do not match!",
          
        });
        return
      }
    }
  }
  
  const registration = signUp(email.value, password.value)
 if(registration.status){
  alert(registration.message);
  window.location.href = './login/index.html'
 }else {
      alert(registration.message);
    }
  }

 // Create user with email and password
  // createUserWithEmailAndPassword(auth, email.value, password.value)
  //   .then(async (userCredential) => {
  //     console.log("User registered and logged in");
  //     const user = userCredential.user;
  //     console.log(user, "====>>> user");

  //     // Save user data in Firestore
  //     try {
  //       const docRef = await setDoc(doc(db, "users", user.uid), {
  //         userName: userName.value,
  //         email: email.value,
  //         uid: user.uid,
  //       });
  //       alert("User data saved successfully");
  //       alert("User registered successfully, redirecting to login page");
        
  //       setTimeout(() => {
  //         window.location.href = "../login/index.html";
  //       }, 2000);
  //     } catch (e) {
  //       alert("Error saving user data");
  //       console.error("Error adding document: ", e);
  //     }
  //   })
  //   .catch((error) => {
  //     // Handle authentication errors
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     console.log(errorCode, "===>>>> errorCode");
  //     console.log(errorMessage, "===>>>> errorMessage");
  //     alert(errorCode);
  //   });


// Event listener for signup button click
signupSubmitBtn.addEventListener('click', signupHandler);
