const userName = document.getElementById('userName');
const email = document.getElementById('email')
const password = document.getElementById('password')
const cPassword = document.getElementById('cPassword')

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if(loggedInUser) window.location.href = '../profile/index.html'

const signupHandler = () => {

    const users = JSON.parse(localStorage.getItem('users')) || []
    
    if (!userName.value || !email.value || !password.value || !cPassword) {
        Swal.fire({
            icon: "error",
            title: "required...",
            text: "please fill all fields carefully!",            
          });
          return;
    } else {
        if(password.value.length < 8 ){
            Swal.fire({
                icon: "error",
                title: "password...",
                text: "Password error!",            
              });
              return;        
    } else {
        if(password.value != cPassword.value) {
        Swal.fire({
            icon: "error",
            title: "password...",
            text: "Password error!",            
          });
          return;        
        }
    }

    const userNameFound = users.find((user)=> {
        if(user.userName === userName.value){
            Swal.fire({
                icon: "error",
                title: "password...",
                text: "Password error!",            
              });
              return user;   
        }
    });

    if(userNameFound){
        Swal.fire({
            icon: "user",
            title: "name already taken...",
            text: "choose another!",            
          });
          return;
    }

    const userEmailFound = users.find((user) => {
        if(user.email === email.value) return user
    })
    
    if(userEmailFound) {
        Swal.fire({
            icon: "user email",
            title: "user email already taken...",
            text: "choose another!",            
          });
          return;

    }

    const user = {
        id: Date.now(),
        userName: userName.value,
        email: email.value,
        password: password.value,
        cPassword: cPassword.value
    }

    users.push(user);

    localStorage.setItem('users', JSON.stringify(users));
    
    alert("Signup Successfully, now you can login, diverting you to the login page")
    setTimeout(() => {
        window.location.href = '../login/index.html'
    }, 2000)


}
