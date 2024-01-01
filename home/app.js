// const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

import {
    addDoc,
    auth,
    collection,
    db,
    getDoc,
    getDocs,
    onAuthStateChanged,
    query,
    signOut,
    doc as docFromFirebase,
    doc,
    deleteDoc,
    setDoc,
  } from "../utilites/app.js";
  
  // if (!loggedInUser) window.location.href = '../login/index.html'
  let userDetails;
  let uid;
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      uid = user.uid;
      console.log(uid, "==>> uid");
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        userDetails = docSnap.data();
        console.log(docSnap.data());
      } else {
        console.log("No Document found");
      }
  
      // ...
    } else {
      // User is signed out
      // ...
      window.location.href = "../login/index.html";
    }
  });
  
  // const userName = document.getElementById('userName')
  
  // userName.innerHTML = JSON.parse(localStorage.getItem('loggedInUser')).userName
  
  const postInput = document.querySelector("#postInput");
  
  const postContentArea = document.querySelector("#postContentArea");
  
  const submitBtn = document.querySelector("#submitBtn");
  const imageBtn = document.querySelector("#imageBtn");
  const logoutBtn = document.querySelector("#logoutBtn");
  
  let imageUrl;
  let oldPost;
  let oldPostIndex;
  
  const postsLocalStorage = JSON.parse(localStorage.getItem("posts")) || [];
  
  // postsLocalStorage.reverse().filter((ele)=> ele.userDetail.email == JSON.parse(localStorage.getItem('loggedInUser')).email)
  
  const postDisplayHandler = async () => {
    postContentArea.innerHTML = "";
  
    //firebase se bht sarey documents lenay jaa raha hun
  
    const posts = [];
    const q = query(collection(db, "posts"));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
  
      const singlePost = doc.data();
  
      posts.push({ ...singlePost, id: doc.id });
  
      //user data laa k do, jis ney posting ki thi
  
      // singlePost.userUid
    });
  
    console.log(posts, "===>> posts");
  
    //bht saara data le kar aa chuka
  
    posts.reverse().forEach((post) => {
      console.log(post, "======>>> post");
      console.log(userDetails, "======>>> userDetails");
      let textHTML;
      if (post?.imgData) {
        textHTML = `
              <div class="card text-center">
              
              <div class="card-header" id="userName">
  
  
              ${
                uid === post?.userDetails.uid
                  ? `<button onclick="editHandler('${post?.id}')">Edit</button> 
                  
                  <img style="border-radius: 50%" width="50px" height="50px" src="${
                    post.userDetails.profileUrl
                      ? post.userDetails.profileUrl
                      : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                  }" />
                  ${post?.userDetails.userName} <button onclick="deleteHandler('${
                      post?.id
                    }')">Delete</button>`
                  : `
                  <img style="border-radius: 50%" width="50px" height="50px" src="${
                    post.userDetails.profileUrl
                      ? post.userDetails.profileUrl
                      : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                  }" />
                  ${post?.userDetails.userName}
                  
                  `
              } 
  
                  </div>
              <div class="card">
    <div class="card-body">
      <h5 class="card-title">Special Post</h5>
      <p class="card-text">${post?.textData}</p>
      <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
    </div>
    <img src='${post?.imgData}' class="card-img-bottom" alt="...">
  </div>
  </div>
              `;
      } else {
        textHTML = `
                  <div class="card text-center">
                  <div class="card-header" id="userName">
                  ${
                    uid === post?.userDetails.uid
                      ? `<button onclick="editHandler('${
                          post?.id
                        }')">Edit</button> 
                      
                      <img style="border-radius: 50%" width="50px" height="50px" src="${
                        post.userDetails.profileUrl
                          ? post.userDetails.profileUrl
                          : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                      }" />
                      ${
                        post?.userDetails.userName
                      } <button onclick="deleteHandler('${
                          post?.id
                        }')">Delete</button>`
                      : `
                      <img style="border-radius: 50%" width="50px" height="50px" src="${
                        post.userDetails.profileUrl
                          ? post.userDetails.profileUrl
                          : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                      }" />
                      ${post?.userDetails.userName}
                      
                      `
                  } 
                  </div>
                  <div class="card-body">
                      <h5 class="card-title">Special Post</h5>
                      <p class="card-text">${post?.textData}.</p>
                  </div>
                  <div class="card-footer text-body-secondary">
                      2 days ago
                  </div>
              </div>
                  `;
      }
  
      postContentArea.innerHTML += textHTML;
    });
  };
  
  postDisplayHandler();
  
  // <a href="#" class="btn btn-primary">Go somewhere</a>
  
  const imageOpenerHandler = () => {
    imageUrl = prompt("Post the link of your image");
  };
  
  window.postSubmitHandler = async () => {
    let postObj;
    console.log(postInput.value, "===>>>postInput");
    if (imageUrl) {
      console.log(imageUrl, "====>>imageUrl");
      postObj = {
        textData: postInput.value,
        imgData: imageUrl,
        userDetails: userDetails,
      };
    } else {
      postObj = {
        textData: postInput.value,
        userDetails: userDetails,
      };
    }
  
    console.log(postObj, "===>>> postObj");
  
    alert("data save karwaney jaa raha hun");
  
    // is jagah per data firebase main save karwana hai
  
    const docRef = await addDoc(collection(db, "posts"), postObj);
    console.log("Document written with ID: ", docRef.id);
  
    // save karwaney k baad input data khali karwa diya
  
    imageUrl = "";
  
    postInput.value = "";
  
    postDisplayHandler();
  };
  
  const logoutHandler = () => {
    //   localStorage.removeItem("loggedInUser");
  
    //   window.location.href = "../login/index.html";
  
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "../login/index.html";
      })
      .catch((error) => {
        // An error happened.
        console.log(error, "===>> error");
      });
  };
  
  window.editHandler = (postId) => {
    console.log("edit handler working properly", postId);
    submitBtn.innerHTML = "Update";
  
    submitBtn.setAttribute("onclick", `updatePostHandler('${postId}')`);
  };
  window.deleteHandler = async (postId) => {
    console.log("delete handler working properly", postId);
    await deleteDoc(doc(db, "posts", postId));
    postDisplayHandler();
  };
  
  window.updatePostHandler = async (postId) => {
    console.log("update post handler working", postId);
  
    // return;
  
    let postObj;
    if (imageUrl) {
      console.log(imageUrl, "====>>imageUrl");
      postObj = {
        textData: postInput.value,
        imgData: imageUrl,
        userDetails: userDetails,
      };
    } else {
      postObj = {
        textData: postInput.value,
        userDetails: userDetails,
      };
    }
  
    console.log(postObj, "===>>>postObj");
  
    await setDoc(doc(db, "posts", postId), postObj);
  
    postDisplayHandler();
  
    submitBtn.innerHTML = "Submit";
  
    submitBtn.setAttribute("onclick", "postSubmitHandler()");
  };
  
  logoutBtn.addEventListener("click", logoutHandler);
  imageBtn.addEventListener("click", imageOpenerHandler);
  // submitBtn.addEventListener("click", postSubmitHandler);
  









































// const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
// // if(!loggedInUser) window.location.href = '../login/index.html'

// const postInput = document.getElementById('postInput');
// const postContentArea = document.querySelector('#postContentArea');
// const submitBtn = document.querySelector('#submitBtn')

// let imageUrl;
// let oldPost;
// let oldPostIndex;

// const postsLocalStorage = JSON.parse(localStorage.getItem('posts')) || [];
// console.log(postsLocalStorage)

// // const postDisplayHandler = () => {
// //     postContentArea.innerHTML = "";

// //     const postsLocalStorage = JSON.parse(localStorage.getItem('posts')) || [];

// //     postsLocalStorage.reverse().forEach(post => {
// //         let textHTML;

// //         const userEmail = loggedInUser?.email;

// //         textHTML = `
// //             <div class="card text-center">
// //                 <div class="card-header" id="userName">
// //                     <img id="ProfileImage" src="./images/profile.png" alt="" width="30px">
// //                     <p class="card-text" id="cardtext1"><small class="text-body-secondary">${Post.time}</small></p>               
// //                     <span id="UserName">${userEmail === post?.userDetail?.email
// //                         ? `<button onclick="editHandler(${post?.id})">Edit</button> ${post?.userDetail?.userName} <button onclick="deleteHandler(${post?.id})">Delete</button>`
// //                         : `${post?.userDetail?.userName}`}
// //                     </span>
                    
// //                 </div>
// //                 <div class="card">
// //                     ${post?.imgData
// //                         ? `
// //                         <div class="card mb-3">
// //                             <img src='${post?.imgData}' class="card-img-bottom" alt="..." id="cardimage">
// //                             <div class="card-body">
// //                                 <h5 class="card-title" id="cardtitle"></h5>
// //                                 <p class="card-text">${post?.textData}</p>
// //                             </div>`
// //                         `                                                    
// //                 </div>
// //             </div>
// //         `

// //         postContentArea.innerHTML += textHTML;
// //     });
// // };

// const postDisplayHandler = () => {
//     postContentArea.innerHTML = "";

//     const postsLocalStorage = JSON.parse(localStorage.getItem('posts')) || [];

//     postsLocalStorage.reverse().forEach(post => {
//         let textHTML;

//         const userEmail = loggedInUser?.email;

//         textHTML = `
//             <div class="card text-center">
//                 <div class="card-header" id="userName">
//                     <img id="ProfileImage" src="./images/profile.png" alt="" width="30px">
//                     <p class="card-text" id="cardtext1"><small class="text-body-secondary">${post.time}</small></p>               
//                     <span id="UserName">${userEmail === post?.userDetail?.email
//                         ? `<button onclick="editHandler(${post?.id})">Edit</button> ${post?.userDetail?.userName} <button onclick="deleteHandler(${post?.id})">Delete</button>`
//                         : `${post?.userDetail?.userName}`}
//                     </span>
                    
//                 </div>
//                 <div class="card">
//                     ${post?.imgData
//                         ? `
//                         <div class="card mb-3">
//                             <img src='${post?.imgData}' class="card-img-bottom" alt="..." id="cardimage">
//                             <div class="card-body">
//                                 <h5 class="card-title" id="cardtitle"></h5>
//                                 <p class="card-text">${post?.textData}</p>
//                             </div>`
//                         `                                                    
//                 </div>
//             </div>
//         `;

//         postContentArea.innerHTML += textHTML;
//     });
// };


// // const postDisplayHandler = () => {
// //     postContentArea.innerHTML = "";

// //     const postsLocalStorage = JSON.parse(localStorage.getItem('posts')) || [];

// //     postsLocalStorage.reverse().forEach(post => {
// //         let textHTML;
// //         const userEmail = loggedInUser?.email; 
// //         if (post?.imgData) {
// //             textHTML = `
// //                 <div class="card text-center">
// //                     <div class="card-header" id="userName">
// //                         ${userEmail === post?.userDetail?.email
// //                             ? `<button onclick="editHandler(${post?.id})">Edit</button> ${post?.userDetail?.userName} <button onclick="deleteHandler(${post?.id})">Delete</button>`
// //                             : `${post?.userDetail?.userName}`}
// //                     </div>
// //                     <div class="card">
// //                         <div class="card-body">
// //                             <h5 class="card-title">Special Post</h5>
// //                             <p class="card-text">${post?.textData}</p>
// //                             <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
// //                         </div>
// //                         <img src='${post?.imgData}' class="card-img-bottom" alt="...">
// //                     </div>
// //                 </div>
// //             `;
// //         }
// //          else {
// //             textHTML = `
// //                 <div class="card text-center">
// //                     <div class="card-header" id="userName">
// //                         ${userEmail === post?.userDetail?.email
// //                             ? `<button onclick="editHandler(${post?.id})">Edit</button> ${post?.userDetail?.userName} <button onclick="deleteHandler(${post?.id})">Delete</button>`
// //                             : `${post?.userDetail?.userName}`}
// //                     </div>
// //                     <div class="card-body">
// //                         <h5 class="card-title">Special Post</h5>
// //                         <p class="card-text">${post?.textData}.</p>
// //                     </div>
// //                     <div class="card-footer text-body-secondary">
// //                         2 days ago
// //                     </div>
// //                 </div>
// //             `;
// //         }
// //         postContentArea.innerHTML += textHTML;
// //     });
// // };

// postDisplayHandler();


// postDisplayHandler()


// const imageOpenerHandler = () => {
//     imageUrl = prompt("add image link")
// }



// const postSubmitHandler = () => {
//     let postObj;
//     if (imageUrl) {
//         postObj = {
//             id: Date.now(),
//             textData: postInput.value,
//             imgData: imageUrl,
//             userDetail: JSON.parse(localStorage.getItem('loggedInUser'))
//         };
//     } else {
//         postObj = {
//             id: Date.now(),
//             textData: postInput.value,
//             userDetail: JSON.parse(localStorage.getItem('loggedInUser'))
//         };
//     }
//     postsLocalStorage.push(postObj);

//     localStorage.setItem('posts', JSON.stringify(postsLocalStorage));

//     imageUrl = "";

//     postInput.value = "";

//     postDisplayHandler();
// };


// const logoutHandler = () => {
//     localStorage.removeItem('loggedInUser')

//     window.location.href = '../login/index.html'
// }


// const editHandler = (postId) =>{

//     const postsLocalStorage = JSON.parse(localStorage.getItem('posts'))

//     const findPost = postsLocalStorage.find((post) => post.id === postId)
//     const findPostIndex = postsLocalStorage.findIndex((post) => post.id === postId)

//     oldPost = findPost
//     oldPostIndex = findPostIndex

//     postInput.value = findPost.textData

//     submitBtn.innerHTML = "Update"

//     submitBtn.setAttribute('onclick', "updatePostHandler()")
// }


// const deleteHandler = (postId) => {
//     const forDelete = JSON.parse(localStorage.getItem('posts'))

//     const filteredData = forDelete.filter((post) => post.id != postId)
    
//     localStorage.setItem('posts', JSON.stringify(filteredData))
    
//     postDisplayHandler()
// }

// const updatePostHandler = () => {
    
//     let postObj
    
//     if (imageUrl) {
       
//         postObj = {
//             textData: postInput.value,
//             imgData: imageUrl,
//             userDetail: JSON.parse(localStorage.getItem('loggedInUser'))
//         }
//     } else {
//         postObj = {
//             textData: postInput.value,
//             userDetail: JSON.parse(localStorage.getItem('loggedInUser'))
//         }
//     }

//     const newUpdatePostData = {
//         id: oldPost?.id,

//         textData: postObj.textData || oldPost.textData,

//         imgData: postObj.imgData || oldPost.imgData,

//         userDetail: JSON.parse(localStorage.getItem('loggedInUser'))
//     }

//     const postsLocalStorage = JSON.parse(localStorage.getItem('posts'))

//     postsLocalStorage.splice(oldPostIndex, 1, newUpdatePostData)

    

//     localStorage.setItem('posts', JSON.stringify(postsLocalStorage))

//     postDisplayHandler()

//     submitBtn.innerHTML = "Submit"

//     submitBtn.setAttribute('onclick', "postSubmitHandler()")

// }