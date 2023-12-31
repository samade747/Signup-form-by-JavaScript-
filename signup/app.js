// importing data form utilites files for firebase
import {
  addDoc,
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  collection,
  db,
  doc,
  onAuthStateChanged,
  setDoc,
 } from "../utilites/app.js";

const userName = document.getElementById('userName');
const email = document.getElementById('email')
const password = document.getElementById('password')
const cPassword = document.getElementById('cPassword')
const signupSubmitBtn = document.getElementById("signupSubmitBtn");
const loginpage = document.getElementById("loginpage");

// local storage
// const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
// if(loggedInUser) window.location.href = '../profile/index.html'

window.addEventListener('load', (event) =>{
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(uid, "==>> uid");
    // ...
  } else {
    // User is signed out
    // ...
    }
    });
});









const signupHandler = () => {

    const users = JSON.parse(localStorage.getItem('users')) || []
    
    if (!userName.value || !email.value || !password.value || !cPassword.value) {
        Swal.fire({
            icon: "error",
            title: "Required...",
            text: "Please fill all fields carefully!",
        });
        return;
    } else {
        if (password.value.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Password...",
                text: "Password should be at least 8 characters long!",
            });
            return;
        } else {
            if (password.value !== cPassword.value) {
                Swal.fire({
                    icon: "error",
                    title: "Password...",
                    text: "Passwords do not match!",
                });
                return;
            }
        }
    }

   
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // ...
      try{
        const docRef = await setDoc(doc(db, 'users', user.uid), {
            userName: userName.value,
            email: email.value,
            uid: user.uid,
        }); 

        alert("Signup Successfully, now you can login, diverting you to the login page")
        setTimeout(() => {
            window.location.href = '../login/index.html'
        }, 2000)        
    } catch(e){
        console.error('Error adding document: ', e);
    }      
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;           
    });
    
}

function loginUp(){
    setTimeout(() => {
        window.location.href = '../login/index.html'
    }, 1000);
}



signupSubmitBtn.addEventListener('click', signupHandler);
loginpage.addEventListener('click', loginUp);


    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   

    // })
    // const userNameFound = users.find((user) => {
    //     return user.userName === userName.value;
    // });
    
    // if (userNameFound) {
    //     Swal.fire({
    //         icon: "error",
    //         title: "Username...",
    //         text: "Username already taken. Choose another!",
    //     });
    //     return;
    // }

    // const user = {
    //     id: Date.now(),
    //     userName: userName.value,
    //     email: email.value,
    //     password: password.value,
    //     cPassword: cPassword.value
    // }

    // users.push(user);

    // localStorage.setItem('users', JSON.stringify(users));
    
    


// function loginUp(){
//     setTimeout(() =>{
//         window.location.href = '../login/index.html'
//     }, 1000);
// }