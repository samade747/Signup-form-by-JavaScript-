import { auth, db, doc, getDoc, onAuthStateChanged, signInWithEmailAndPassword } from "../utilites/app.js";



const email = document.getElementById('email')
const password = document.getElementById('password')
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const signupf = document.getElementById("signupf");
console.log(signupf);


// const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

// if(loggedInUser) window.location.href = '../home/index.html'

onAuthStateChanged(auth, async(user) => {  //login
  if (user) {  //login
    const uid = user.uid;
    console.log(uid, "==>> uid");
    alert("user log in huwa hai")
    const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        alert("is user ka data mojood hai")
        window.location.href = "../home/index.html";
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    // ...
  } else {
    alert("signout huwa hai")
  }
});




const loginUp = () => {

    // const users = JSON.parse(localStorage.getItem('users'))

        if (!email.value || !password.value){
        Swal.fire({
            icon: "error",
            title: "email...",
            text: "email error!",
        });
        return;
    } else if (password.value.length < 8){
        Swal.fire({
            icon: "error",
            title: "Password...",
            text: "Password should be at least 8 characters long!",
        });
        return;

    } 

    // if (!users){
    //     Swal.fire({
    //         icon: "error",
    //         title: "Password...",
    //         text: "Password should be at least 8 characters long!",
    //     });
    //     return;

    // } 

    // const foundUser = users.find(user => {
    //     if (user.email === email.value) return user
    // });


    // if (!foundUser) {
    //     Swal.fire({
    //         icon: "error",
    //         title: "No User Found...",
    //         text: "user not found!",
    //     });
    //     return;
    // }
    
      
    // if (foundUser.password !== password.value) {
    //     Swal.fire({
    //         icon: "error",
    //         title: "Invalid Credentials...",
    //         text: "Invalid Credentials!",
    //     });
    //     return;
    // } else {
    //     Swal.fire({
    //         icon: "sucess",
    //         title: "Login Successfully, diverting you to the home page...",
    //         text: "Login Successfully, diverting you to the home page!",
    //     });
        
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => { //login
      // Signed in
      const user = userCredential.user;
      console.log(user, "===>> user");

      alert("Login Successfully, diverting you to the home page");

      //   localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

      setTimeout(() => {
        window.location.href = "../home/index.html";
      }, 2000);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
    });
};
    

    
    // signInWithEmailAndPassword(auth, email.value, password.value)
    // .then((userCredential) => {
    //   // Signed in
    //   const user = userCredential.user;
    //   console.log(user, "===>> user");

    //   alert("Login Successfully, diverting you to the home page");

    //   //   localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    //   setTimeout(() => {
    //     window.location.href = "../home/index.html";
    //   }, 2000);
    //   // ...
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   alert(errorCode);
    // });




    // localStorage.setItem('loggedInUser', JSON.stringify(foundUser))

    // setTimeout(() => {
    //     window.location.href = '../home/index.html'
    // }, 2000)








// function redirectionTomainpage(){
//     setTimeout(() => {
//         window.location.href = '../signup/index.html'
//     }, 1000);


// }

loginSubmitBtn.addEventListener("click", loginUp);
// signupf.addEventListener('click', redirectionTomainpage);