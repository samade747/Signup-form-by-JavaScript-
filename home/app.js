import { addInDB, getAllDataOrderedByTimestamp, getData, getLoggedInUser, uploadFile, deletData } from "../utilites/functions.mjs";
// import { deleteDoc, doc, db, collection, getDocs, where, query } from "../utilites/app.js";
// import { deleteDoc, doc, db } from "./app.js";


const postInput = document.querySelector("#postInput");
const postContentArea = document.querySelector("#postContentArea");
const submitBtn = document.querySelector("#submitBtn");
const imageBtn = document.querySelector("#imageBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const ppimage = document.querySelectorAll('.ppimage')
const profilePicture = document.getElementById('profilePicture');
const profilePicture2 = document.getElementById('profilePicture2');
let deletPost = document.querySelector("#deletPost");
console.log(ppimage)


let uid;

const checkLogin = async () => {
  console.log("===>>> checking login user")
  const loggedInUser = await getLoggedInUser()
  uid = loggedInUser.uid
  if (loggedInUser) {
    console.log("===>>> user logged in", loggedInUser)

    // get user data from db
    const userData = await getData(loggedInUser.uid, "users")
    if (userData.status) {
      console.log("===>>> user data", userData.data)
      profilePicture.src = userData.data.profilePicture || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"
    } else {
      console.log("===>>> user data not found")
    }
  } else {
    console.log("===>>> user not logged in")
    window.location.href = "../index.html"
  }
}

checkLogin()

const postDisplayHandler = async () => {
  console.log("===>>> post display handler")
  const posts = await getAllDataOrderedByTimestamp("posts")
  console.log("===>>> posts", posts)
  if (posts.status) {

    // Use Promise.all to await all promises in the loop
    const postsWithDataPromises = posts.data.map(async (post) => {
    const userData = await getData(post.authorId, "users");

      console.log(userData, "===>>userData")

      // Add user data to the post
      const postWithUserData = {
        ...post,
        userData: userData ? userData.data : null,
        userId: uid,
        
      };


      return postWithUserData;
    });

    // Wait for all promises to resolve
    const postsWithData = await Promise.all(postsWithDataPromises);

    console.log("===>>> posts with data", postsWithData)

    renderPosts(postsWithData)
  } else {
    console.log("===>>> posts not found")
  }
}

postDisplayHandler()

const renderPosts = (posts) => {
  postContentArea.innerHTML = "";
  posts.forEach((post) => {
    const isCurrentUserPost = post.authorId === uid;
    const postElement = document.createElement("div");
    postElement.setAttribute("class", "card text-center");
    postElement.setAttribute("id", post.id); // Add post ID as a data attribute
    postElement.innerHTML = `
      <div class="card-header" id="userName">
        ${post.userData?.userName || "No User Name"}
      </div>
      <div class="card-body">
        <h5 class="card-title">Heading</h5>
        <p class="card-text">${post.post}</p>
        ${post.imageUrl && `<img src="${post.imageUrl}" class="card-img-top" alt="...">`}
        ${isCurrentUserPost ? `<button class="btn btn-danger delete-btn" id="deletPost" onclick="console.log('${post.id}'); window.deletPostHandler('${post.id}')">Delete</button>
        ` : ''}
      </div>
      <div class="card-footer text-body-secondary">
        ${post.userData?.email || "No Email"}
      </div>
    `;
    postContentArea.appendChild(postElement);
  });

  // document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
  //   deleteBtn.addEventListener("click", deletePostHandler);
  // });
};

document.addEventListener("DOMContentLoaded", () => {
  postDisplayHandler();
});




let imageUrl;

const postSubmitHandler = async () => {
  postContentArea.innerHTML = "Loading"
  console.log("===>>> post submit handler")
  if (!postInput.value) {
    alert("Please enter post")
    return
  }
  
  const data = {
    post: postInput.value,
    authorId: uid,
  }

  // upload image to storage
  if (imageInput.files[0]) {
    const imageName = `${new Date().getTime()}-${imageInput.files[0].name}`
    const upload = await uploadFile(imageInput.files[0], imageName)
    if (upload.status) {
      data.imageUrl = upload.downloadURL
      alert(upload.message)
    } else {
      alert(upload.message)
    }
  }





  const postAddInDB = await addInDB(data, "posts")
  if (postAddInDB.status) {
    console.log(postAddInDB)
    // Access the documentId
    const documentId = postAddInDB.data.id;
    console.log(documentId)
    console.log(typeof(documentId))
    alert(`Post added successfully with ID: ${documentId}`);
    const documentReference = postAddInDB.data;
    postInput.value = ""
    imageInput.value = ""
    postDisplayHandler()
  } else {
    alert(postAddInDB.message);
  }

}

// const getAllDataOrderedByTimestamp = async (collection) => {
//   try {
//     const querySnapshot = await firestore.collection(collection).orderBy('timestamp', 'desc').get();
//     const posts = querySnapshot.docs.map(doc => ({
//       id: doc.id, // This is the document ID
//       ...doc.data(), // Other data from the document
//     }));
//     return { status: true,
//              data: posts 
//             };
//   } catch (error) {
//     console.error('Error getting posts:', error);
//     return { status: false,
//              message: 'Error getting posts' 
//             };
//   }
// };




window.deletPostHandler = async (postId) => {
  const deletingPost = await deletData("posts", postId);
  console.log(deletingPost)
  if (deletingPost.status) {
    alert(deletingPost.message);
    postDisplayHandler()
  } else {
    alert(deletingPost.message);
  }
};






document.addEventListener("DOMContentLoaded", () => {  postDisplayHandler();
});

submitBtn.addEventListener('click', postSubmitHandler)


