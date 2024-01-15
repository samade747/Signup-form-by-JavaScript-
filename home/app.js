import { addInDB, getAllDataOrderedByTimestamp, getData, getLoggedInUser, uploadFile, logout, addInDBById } from "../utilites/functions.mjs";

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
  console.log("===>>> checking login user");

  // Get the logged-in user
  const loggedInUser = await getLoggedInUser();

  // Check if the user is logged in
  if (loggedInUser && loggedInUser.uid) {
    uid = loggedInUser.uid;
    console.log("===>>> user logged in", loggedInUser);

    // get user data from db
    const userData = await getData(loggedInUser.uid, "users");
    if (userData.status) {
      console.log("===>>> user data", userData.data);
      profilePicture.src =
        userData.data.profilePicture ||
        "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg";
    } else {
      console.log("===>>> user data not found");
    }
  } else {
    console.log("===>>> user not logged in");
    window.location.href = "../index.html";
  }
};



// const checkLogin = async () => {
//   console.log("===>>> checking login user")
//   const loggedInUser = await getLoggedInUser()
//   uid = loggedInUser.uid
//   if (loggedInUser) {
//     console.log("===>>> user logged in", loggedInUser)

//     // get user data from db
//     const userData = await getData(loggedInUser.uid, "users")
//     if (userData.status) {
//       console.log("===>>> user data", userData.data)
//       profilePicture.src = userData.data.profilePicture || "https://t3.ftcdn.net/jpg/05/00/54/28/360_F_500542898_LpYSy4RGAi95aDim3TLtSgCNUxNlOlcM.jpg"
//     } else {
//       console.log("===>>> user data not found")
//     }
//   } else {
//     console.log("===>>> user not logged in")
//     window.location.href = "../index.html"
//   }
// }

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
  console.log("===>>> render posts", posts)
  postContentArea.innerHTML = ""
  posts.forEach(post => {
    console.log(post);
    postContentArea.innerHTML += `
    <div class="card text-center">
    <div class="card-header" id="userName">
        ${post.userData.userName || "No User Name"}
    </div>
    <div class="card-body">
        <h5 class="card-title">Heading</h5>
        <p class="card-text">${post.post}</p>
        ${post.imageUrl && `<img src="${post.imageUrl}" class="card-img-top" alt="...">`}
        <a href="#" class="btn btn-primary">Go somewhere</a>
        ${post.authorId === uid && post.id ? `<button class="btn btn-danger delete-btn" data-id="${post.id}">Delete</button>` : ''}
    </div>
    <div class="card-footer text-body-secondary">
        ${post.userData.email}
    </div>
</div>
    `
  });
}

let imageUrl;

const postSubmitHandler = async () => {
  postContentArea.innerHTML = "Loading"
  console.log("===>>> post submit handler")
  if (!postInput.value) {
    alert("Please enter post")
    return
  }

  // creating a post unique id 
  // const postId = `${uid}.${Date.now()}`;

  const data = {
    // id: postId,
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

  const postAddInDB = await addInDBById(data, id, "posts")
  if (postAddInDB.status) {
    alert(postAddInDB.message)
    postInput.value = ""
    imageInput.value = ""
    postDisplayHandler()
  } else {
    alert(postAddInDB.message)
  }

}


//   const postAddInDB = await addInDB(data, "posts")
//   if (postAddInDB.status) {
//     alert(postAddInDB.message)
//     postInput.value = ""
//     imageInput.value = ""
//     postDisplayHandler()
//   } else {
//     alert(postAddInDB.message)
//   }

// }

const logoutbtnHanlder = async () =>{

  const logoutStatus = await logout()
  if(logoutStatus.status){
    window.location.href = '../index.html'
  } else {
    console.log('login failed please try again')
  }
}



const deletePostHandler = async (postId) => {
  // Fetch the post data
  const post = await getData(postId, "posts");

  // Check if the post data was fetched successfully
  if (!post || !post.data) {
    console.log(`Failed to fetch post with ID: ${postId}`);
    return;
  }

  // Check if the logged-in user is the author of the post
  if (post.data.authorId !== uid) {
    console.log("User is not the author of the post");
    return;
  }

  // Delete the post
  const deleteStatus = await deleteFromDB(postId, "posts");
  if (deleteStatus.status) {
    console.log("Post deleted successfully");
    // Refresh the posts
    postDisplayHandler();
  } else {
    console.log("Failed to delete post");
  }
};









logoutBtn.addEventListener('click', logoutbtnHanlder);
submitBtn.addEventListener('click', postSubmitHandler);

postContentArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.preventDefault();
    const postId = e.target.getAttribute('data-id'); // Use getAttribute to ensure you get the data-id value
    console.log('Post ID:', postId);  // Log the postId to the console
    if (!postId) {
      console.log('Failed to get post ID');
      return;
    }
    deletePostHandler(postId);
  }
});

// // Event listeners
// logoutBtn.addEventListener("click", logoutHandler);
// imageBtn.addEventListener("click", imageOpenerHandler);
