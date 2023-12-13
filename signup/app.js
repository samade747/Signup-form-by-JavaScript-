const userName = document.getElementById('userName');
const email = document.getElementById('email')
const password = document.getElementById('password')
const cPassword = document.getElementById('cPassword')

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
if(loggedInUser) window.location.href = '../profile/index.html'

const signupHandler = () => {

    const users = JSON.parse(localStorage.getItem('users')) || []
    
    if (!userName.value || !email.value || !password.value || !cPassword.value) {
        Swal.fire({
            icon: "error",
            title: "Required...",
            text: "Please fill all fields carefully!",
        });
        return;
    } else {
        if (password.value.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Password...",
                text: "Password should be at least 8 characters long!",
            });
            return;
        } else {
            if (password.value !== cPassword.value) {
                Swal.fire({
                    icon: "error",
                    title: "Password...",
                    text: "Passwords do not match!",
                });
                return;
            }
        }
    }
    
    const userNameFound = users.find((user) => {
        return user.userName === userName.value;
    });
    
    if (userNameFound) {
        Swal.fire({
            icon: "error",
            title: "Username...",
            text: "Username already taken. Choose another!",
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
