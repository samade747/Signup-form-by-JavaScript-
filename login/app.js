const email = document.getElementById('email')
const password = document.getElementById('password')

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))

if(loggedInUser) window.location.href = '../home/index.html'



const loginUp = () => {

    const users = JSON.parse(localStorage.getItem('users'))

        if (!email.value || !password.value){
        Swal.fire({
            icon: "error",
            title: "email...",
            text: "email error!",
        });
        return;
    } else if (password.value.length < 8){
        Swal.fire({
            icon: "error",
            title: "Password...",
            text: "Password should be at least 8 characters long!",
        });
        return;

    } 

    if (!users){
        Swal.fire({
            icon: "error",
            title: "Password...",
            text: "Password should be at least 8 characters long!",
        });
        return;

    } 

    const foundUser = users.find(user => {
        if (user.email === email.value) return user
    });


    if (!foundUser) {
        Swal.fire({
            icon: "error",
            title: "No User Found...",
            text: "user not found!",
        });
        return;
    }
    
      
    if (foundUser.password !== password.value) {
        Swal.fire({
            icon: "error",
            title: "Invalid Credentials...",
            text: "Invalid Credentials!",
        });
        return;
    } else {
        Swal.fire({
            icon: "sucess",
            title: "Login Successfully, diverting you to the home page...",
            text: "Login Successfully, diverting you to the home page!",
        });
        

    }
    
    localStorage.setItem('loggedInUser', JSON.stringify(foundUser))

    setTimeout(() => {
        window.location.href = '../home/index.html'
    }, 2000)





}


function redirectiontomainpage(){
    setTimeout(() => {
        window.location.href = '../signup/index.html'
    }, 1000)


}