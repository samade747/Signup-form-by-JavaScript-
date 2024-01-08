import { addInDB, getAllDataOrderedByTimestamp, getData, getLoggedInUser, uploadFile } from "../utilites/functions.mjs";

const postInput = document.querySelector("#postInput");
const postContentArea = document.querySelector("#postContentArea");
const submitBtn = document.querySelector("#submitBtn");
const imageBtn = document.querySelector("#imageBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const ppimage = document.querySelectorAll('.ppimage')
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
  console.log("===>>> render posts", posts)
  postContentArea.innerHTML = ""
  posts.forEach(post => {
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
    alert(postAddInDB.message)
    postInput.value = ""
    imageInput.value = ""
    postDisplayHandler()
  } else {
    alert(postAddInDB.message)
  }

}

submitBtn.addEventListener('click', postSubmitHandler)


// // checking login functionality 
// const checkLogin = async () => {
//   console.log('===> checkig login user')
//   const loggedInUser = await getLoggedInUser()
//   if(loggedInUser){
//     console.log('===> user logged in ', loggedInUser)

//   // getting user data from database
//   const userData = await getData(loggedInUser.uid, 'users')
//     if(userData.status){
//       ppimage.src = userData.data.ppimage || 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png'
//     } else {
//       console.log("===>>> user data not found")
//     }
//   } else {
//     console.log('===> user not logged in ')
//     window.location.href = '../index.html'
//   }

// }

// checkLogin()

// // Event listeners
// logoutBtn.addEventListener("click", logoutHandler);
// imageBtn.addEventListener("click", imageOpenerHandler);
