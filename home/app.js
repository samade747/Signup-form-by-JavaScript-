import { getData, getLoggedInUser } from "../utilites/functions.mjs";

const postInput = document.querySelector("#postInput");
const postContentArea = document.querySelector("#postContentArea");
const submitBtn = document.querySelector("#submitBtn");
const imageBtn = document.querySelector("#imageBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const ppimage = document.querySelectorAll('.ppimage')
console.log(ppimage)

// checking login functionality 
const checkLogin = async () => {
  console.log('===> checkig login user')
  const loggedInUser = await getLoggedInUser()
  if(loggedInUser){
    console.log('===> user logged in ', loggedInUser)

  // getting user data from database
  const userData = await getData(loggedInUser.uid, 'users')
    if(userData.status){
      ppimage.src = userData.data.ppimage || 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png'
    } else {
      console.log("===>>> user data not found")
    }
  } else {
    console.log('===> user not logged in ')
    window.location.href = '../index.html'
  }

}

checkLogin()



// import {
//   addDoc,
//   auth,
//   collection,
//   db,
//   getDocs,
//   onAuthStateChanged,
//   query,
//   signOut,
//   doc as docFromFirebase,
//   doc,
//   deleteDoc,
//   setDoc,
// } from "../utilites/app.js";

// let userDetails;
// let uid;

// // Checking the authentication state of the user
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//       // If user is signed in
//       uid = user.uid;
//       const docRef = doc(db, "users", uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//           userDetails = docSnap.data();
//       } else {
//           console.log("No Document found");
//       }
//   } else {
//       // If user is signed out, redirect to login page
//       window.location.href = "../login/index.html";
//   }
// });

// // DOM elements
// const postInput = document.querySelector("#postInput");
// const postContentArea = document.querySelector("#postContentArea");
// const submitBtn = document.querySelector("#submitBtn");
// const imageBtn = document.querySelector("#imageBtn");
// const logoutBtn = document.querySelector("#logoutBtn");

// let imageUrl;

// // Function to display posts
// const postDisplayHandler = async () => {
//   postContentArea.innerHTML = "";

//   // Fetching posts from Firebase
//   const posts = [];
//   const q = query(collection(db, "posts"));
//   const querySnapshot = await getDocs(q);

//   querySnapshot.forEach(async (doc) => {
//       const singlePost = doc.data();
//       posts.push({ ...singlePost, id: doc.id });
//   });

//   // Displaying posts in reverse order
//   posts.reverse().forEach((post) => {
//       let textHTML;
//       // Your card template remains unchanged
//       postContentArea.innerHTML += textHTML;
//   });
// };

// postDisplayHandler();

// // Function to handle image input
// const imageOpenerHandler = () => {
//   imageUrl = prompt("Enter the link of your image");
// };

// // Function to handle post submission
// window.postSubmitHandler = async () => {
//   let postObj;

//   // Checking if an image URL is provided
//   if (imageUrl) {
//       postObj = {
//           textData: postInput.value,
//           imgData: imageUrl,
//           userDetails: userDetails,
//       };
//   } else {
//       postObj = {
//           textData: postInput.value,
//           userDetails: userDetails,
//       };
//   }

//   alert("Saving data...");

//   // Adding post to Firebase
//   const docRef = await addDoc(collection(db, "posts"), postObj);
//   imageUrl = "";
//   postInput.value = "";
//   postDisplayHandler();
// };

// // Function to handle user logout
// const logoutHandler = () => {
//   // Signing out user and redirecting to login page
//   signOut(auth)
//       .then(() => {
//           window.location.href = "../login/index.html";
//       })
//       .catch((error) => {
//           console.log(error);
//       });
// };

// // Function to handle post editing
// window.editHandler = (postId) => {
//   submitBtn.innerHTML = "Update";
//   submitBtn.setAttribute("onclick", `updatePostHandler('${postId}')`);
// };

// // Function to handle post deletion
// window.deleteHandler = async (postId) => {
//   await deleteDoc(doc(db, "posts", postId));
//   postDisplayHandler();
// };

// // Function to handle updating a post
// window.updatePostHandler = async (postId) => {
//   let postObj;

//   // Checking if an image URL is provided
//   if (imageUrl) {
//       postObj = {
//           textData: postInput.value,
//           imgData: imageUrl,
//           userDetails: userDetails,
//       };
//   } else {
//       postObj = {
//           textData: postInput.value,
//           userDetails: userDetails,
//       };
//   }

//   // Updating post in Firebase
//   await setDoc(doc(db, "posts", postId), postObj);
//   postDisplayHandler();
//   submitBtn.innerHTML = "Submit";
//   submitBtn.setAttribute("onclick", "postSubmitHandler()");
// };

// // Event listeners
// logoutBtn.addEventListener("click", logoutHandler);
// imageBtn.addEventListener("click", imageOpenerHandler);
