// Importing necessary modules from utilities/app.js
import {
  signUp,
  addInDBById,
  uploadFile
  
} from "./utilites/functions.mjs"; 


// Selecting form elements
const name = document.getElementById('Name');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const cPassword = document.getElementById('cPassword');
const profilePicture = document.getElementById('profilePicture');
const signupSubmitBtn = document.getElementById("signupSubmitBtn");



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

  try {
    // Call the signUp function from utilities
    const registering = await signUp(email.value, password.value);

    if (registering.status) {
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
         window.location.href = '/home/index.html';
        });
      } else {
        console.error("Firebase Authentication Error:", registering.message);
        // Show error message with Swal
        Swal.fire({
          icon: "error",
          title: "Error",
          text: userAddInDB.message,
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
  }catch (error) {
    // Handle any additional errors
    console.error("Unexpected Error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while registering the user.",
    });
  }
}

// Event listener for signup button click
signupSubmitBtn.addEventListener('click', signupHandler);
