const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if(!loggedInUser) window.location.href = '../login/index.html'

const postInput = document.querySelector('#postContent');
const postContentArea = document.querySelector('#postContent');
const submitBtn = document.querySelector('#submitBtn')

let imageUrl;
let oldPost;
let oldPostIndex;

const postsLocalStorage = JSON.parse(localStorage.getItem('posts')) || []