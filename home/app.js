import { addInDB, getAllDataOrderedByTimestamp, getData, getLoggedInUser, uploadFile,  } from "../utilites/functions.mjs";
import { deleteDoc, doc, db } from "../utilites/app.js";

const postInput = document.querySelector("#postInput");
const postContentArea = document.querySelector("#postContentArea");
const submitBtn = document.querySelector("#submitBtn");
const imageBtn = document.querySelector("#imageBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const ppimage = document.querySelectorAll('.ppimage')
const profilePicture = document.getElementById('profilePicture');
const profilePicture2 = document.getElementById('profilePicture2');
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
    postElement.setAttribute("data-postid", post.id); // Add post ID as a data attribute
    postElement.innerHTML = `
      <div class="card-header" id="userName">
        ${post.userData?.userName || "No User Name"}
      </div>
      <div class="card-body">
        <h5 class="card-title">Heading</h5>
        <p class="card-text">${post.post}</p>
        ${post.imageUrl && `<img src="${post.imageUrl}" class="card-img-top" alt="...">`}
        ${isCurrentUserPost ? `<button class="btn btn-danger delete-btn" onclick="deletePostHandler('${post.id}')">Delete</button>` : ''}
      </div>
      <div class="card-footer text-body-secondary">
        ${post.userData?.email || "No Email"}
      </div>
    `;
    postContentArea.appendChild(postElement);
  });

  document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", deletePostHandler);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  postDisplayHandler();
});



// const renderPosts = (posts) => {
//   console.log("===>>> render posts", posts)
//   postContentArea.innerHTML = ""
//   posts.forEach(post => {
//     const isCurrentUserPost = post.authorId === uid;
//     postContentArea.innerHTML += `
//   <div class="card text-center">
//     <div class="card-header" id="userName">
//       ${post.userData?.userName || "No User Name"}
//     </div>
//     <div class="card-body">
//       <h5 class="card-title">Heading</h5>
//       <p class="card-text">${post.post}</p>
//       ${post.imageUrl && `<img src="${post.imageUrl}" class="card-img-top" alt="...">`}
//       ${isCurrentUserPost ? `<button class="btn btn-danger delete-btn" data-postid="${post.id}">Delete</button>` : ''}
//     </div>
//     <div class="card-footer text-body-secondary">
//       ${post.userData?.email || "No Email"}
//     </div>
//   </div>
// `
// });
//   document.querySelectorAll('.delete-btn').forEach((deleteBtn) => {
//     deleteBtn.addEventListener('click', deletePostHandler);
//   });

// }

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
    alert(`Post added successfully with ID: ${documentId}`);
    const documentReference = postAddInDB.data;
    postInput.value = ""
    imageInput.value = ""
    postDisplayHandler()
  } else {
    alert(postAddInDB.message);
  }

}



// const deletePostHandler = async (event) => {
//   const deleteBtn = event.target;
//   const postId = deleteBtn.getAttribute('data-postid');

//   if (postId) {
//     // Confirm deletion with the user
//     const confirmDelete = confirm('Are you sure you want to delete this post?');

//     if (confirmDelete) {
//       // Implement the delete functionality
//       const deleteResult = await deletePost(postId);

//       if (deleteResult.status) {
//         alert('Post deleted successfully');
//         postDisplayHandler(); // Refresh posts after deletion
//       } else {
//         alert('Error deleting post');
//       }
//     }
//   } else {
//     console.error('Post ID not found on delete button.');
//   }
// };

// const deletePost = async (postId) => {
//   try {
//     // Make an API call to delete the post based on the document ID using Firebase
//     await firebase.firestore().collection('posts').doc(postId).delete();

//     // Successful deletion
//     return { status: true, message: 'Post deleted successfully' };
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     return { status: false, message: 'An unexpected error occurred' };
//   }
// };

// window.deletePostHandler = async (postId) => {
//   console.log("postId ==>>" + postId);

//   try {
//     // Delete the document using deleteDoc
//     await deleteDoc(doc(db, "posts", postId));

//     // Reload the page after successful deletion
//     // window.location.reload();
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     // Handle the error accordingly, e.g., show an alert
//   }
// };


// document.addEventListener("click", async (event) => {
//   const deleteBtn = event.target.closest(".delete-btn");
//   if (deleteBtn) {
//     const postElement = deleteBtn.closest(".card");
//     const postId = postElement.dataset.postid;
    
//     const confirmDelete = confirm("Are you sure you want to delete this post?");

//     if (confirmDelete) {
//       try {
//         // Delete the document using deleteDoc
//         await deleteDoc(doc(db, "posts", postId));

//         // Remove the deleted post from the UI
//         postElement.remove();
//       } catch (error) {
//         console.error("Error deleting post:", error);
//         // Handle the error accordingly, e.g., show an alert
//       }
//     }
//   }
// });


// // document.addEventListener("click", async (event) => {
// //   const deleteBtn = event.target.closest(".delete-btn");
// //   if (deleteBtn) {
// //     const postElement = deleteBtn.closest(".card");
// //     const postId = postElement.dataset.postid;

// //     const confirmDelete = confirm("Are you sure you want to delete this post?");

// //     if (confirmDelete) {
// //       try {
// //         if (!postId) {
// //           console.error("Invalid post ID");
// //           return;
// //         }

// //         // Delete the document using deleteDoc
// //         await deleteDoc(doc(db, "posts", postId));

// //         // Remove the deleted post from the UI
// //         postElement.remove();
// //       } catch (error) {
// //         console.error("Error deleting post:", error);
// //         // Handle the error accordingly, e.g., show an alert
// //       }
// //     }
// //   }
// // });

// window.deletePost = async (postId) => {
//   console.log("postId ==>>" + postId);

//   try {
//     if (!postId) {
//       console.error('Invalid postId');
//       return;
//     }

//     // Convert postId to a string if it's not already
//     const postIdString = postId.toString();

//     // Delete the document using deleteDoc
//     await deleteDoc(doc(db, 'posts', postIdString));

//     // Reload the page after successful deletion
//     window.location.reload();
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     // Handle the error accordingly, e.g., show an alert
//   }
// };

const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    return { status: true, message: 'Post deleted successfully' };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { status: false, message: 'An unexpected error occurred' };
  }
};

// Function to handle post deletion
window.deletePostHandler = async (postId) => {
  console.log("postId ==>>" + postId);

  try {
    const confirmDelete = confirm('Are you sure you want to delete this post?');

    if (confirmDelete) {
      const deleteResult = await deletePost(postId);

      if (deleteResult.status) {
        alert('Post deleted successfully');
        postDisplayHandler(); // Refresh posts after deletion
      } else {
        alert('Error deleting post');
      }
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    // Handle the error accordingly, e.g., show an alert
  }
};





















document.addEventListener("DOMContentLoaded", () => {
  postDisplayHandler();
});


submitBtn.addEventListener('click', postSubmitHandler)


