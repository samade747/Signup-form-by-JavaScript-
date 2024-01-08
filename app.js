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
  }

  
    //calling signup function from utils/functions.mjs
    const registering = await signUp(email.value, password.value)
    if (registering.status) {
        const profilePictureName = `${new Date().getTime()}-${profilePicture.files[0].name}`
        //calling uploadFile function from utils/functions.mjs
        const upload = await uploadFile(profilePicture.files[0], profilePictureName)
        if (upload.status) {
            data.profilePicture = upload.downloadURL
            alert(upload.message)
        } else {
            alert(upload.message)
        }
        //calling addInDBById function from utils/functions.mjs
        const userAddInDB = await addInDBById(data, registering.data.user.uid, "users")
        if (userAddInDB.status) {
            alert(userAddInDB.message)
            alert(registering.message)
            window.location.href = "./home/index.html"
        } else {
            alert(userAddInDB.message)
        }
    } else {
        alert(registering.message)
    }
}
signupSubmitBtn.addEventListener('click', signupHandler)