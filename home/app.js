const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
// if(!loggedInUser) window.location.href = '../login/index.html'

const postInput = document.querySelector('#postContent');
const postContentArea = document.querySelector('#postContent');
const submitBtn = document.querySelector('#submitBtn')

let imageUrl;
let oldPost;
let oldPostIndex;

const postsLocalStorage = JSON.parse(localStorage.getItem('posts')) || []
console.log(postsLocalStorage)


const postDisplayHandler = () => {
    postContentArea.innerHTML = ""
    
    const postsLocalStorage = JSON.parse(localStorage.getItem('posts')) || []
    
    postsLocalStorage.reverse().forEach(post => {
        let textHTML; 
        if(post?.imgData){
            textHTML = `
            <div class="card text-center">
            <div class="card-header" id="userName">
                   ${loggedInUser.email === post?.userDetail.email ? `<button onclick="editHandler(${post?.id})">Edit</button> ${post?.userDetail.userName} <button onclick="deleteHandler(${post?.id})">Delete</button>` : `${post?.userDetail.userName}`} 
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
            `
        } else {
            textHTML = `
                <div class="card text-center">
                <div class="card-header" id="userName">
                   ${loggedInUser.email === post?.userDetail.email ? `<button onclick="editHandler(${post?.id})">Edit</button> ${post?.userDetail.userName} <button onclick="deleteHandler(${post?.id})">Delete</button>` : `${post?.userDetail.userName}`} 
                </div>
                <div class="card-body">
                    <h5 class="card-title">Special Post</h5>
                    <p class="card-text">${post?.textData}.</p>
                </div>
                <div class="card-footer text-body-secondary">
                    2 days ago
                </div>
            </div>
                `

        } 
        postContentArea.innerHTML += textHTML

    });

}

postDisplayHandler()


const imageOpenerHandler = () => {
    imageUrl = prompt("add image link")
}

const postSubmitHandler(){
    let postObj
    if (imageUrl) {
        console.log(imageUrl, "====>>imageUrl")
        postObj = {
            id: Date.now(),
            textData: postInput.value,
            imgData: imageUrl,
            userDetail: JSON.parse(localStorage.getItem('loggedInUser'))
        }
    } else {
        postObj = {
            id: Date.now(),
            textData: postInput.value,
            userDetail: JSON.parse(localStorage.getItem('loggedInUser'))
        }
    }
    postsLocalStorage.push(postObj)

    localStorage.setItem('posts', JSON.stringify(postsLocalStorage))

    imageUrl = ""

    postInput.value = ""

    postDisplayHandler()



    
}


const logoutHandler = () => {
    localStorage.removeItem('loggedInUser')

    window.location.href = '../login/index.html'
}


const editHandler = (postId) =>{

    const postsLocalStorage = JSON.parse(localStorage.getItem('posts'))

    const findPost = postsLocalStorage.find((post) => post.id === postId)
    const findPostIndex = postsLocalStorage.findIndex((post) => post.id === postId)

    oldPost = findPost
    oldPostIndex = findPostIndex

    postInput.value = findPost.textData

    submitBtn.innerHTML = "Update"

    submitBtn.setAttribute('onclick', "updatePostHandler()")
}


const deleteHandler = (postId) => {
    const forDelete = JSON.parse(localStorage.getItem('posts'))

    const filteredData = forDelete.filter((post) => post.id != postId)
    
    localStorage.setItem('posts', JSON.stringify(filteredData))
    
    postDisplayHandler()
}