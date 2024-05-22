const container = document.querySelector(".container"),
      pwShowHide = document.querySelectorAll(".showHidePw"),
      pwFields = document.querySelectorAll(".password"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link");


    //   js code to show/hide password and change icon
    pwShowHide.forEach(eyeIcon =>{
        eyeIcon.addEventListener("click", ()=>{
            pwFields.forEach(pwField =>{
                if(pwField.type ==="password"){
                    pwField.type = "text";

                    pwShowHide.forEach(icon =>{
                        icon.classList.replace("uil-eye-slash", "uil-eye");
                    })
                }else{
                    pwField.type = "password";

                    pwShowHide.forEach(icon =>{
                        icon.classList.replace("uil-eye", "uil-eye-slash");
                    })
                }
            }) 
        })
    })

    // js code to appear signup and login form
    signUp.addEventListener("click", ( )=>{
        container.classList.add("active");

    });
    login.addEventListener("click", ( )=>{
        container.classList.remove("active");
    });

// In-memory user database
const users = [
    { username: 'user1', email: 'user1@example.com', password: 'password1' },
    { username: 'user2', email: 'user2@example.com', password: 'password2' }
];

// Function to handle login
function loginUser(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        alert('Login successful!');
        // Redirect to the home page
        window.location.href = '../Home/home.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Function to handle registration
function registerUser(name, email, password) {
    // Check if the email is already registered
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('Email already registered. Please use a different email.');
        return;
    }

    // Add the new user to the database
    const newUser = { username: name, email: email, password: password };
    users.push(newUser);
    alert('Registration successful! You can now login.');
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Event listener for login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = loginForm.querySelector('input[id="username"]').value;
        const password = loginForm.querySelector('input[id="password"]').value;
        login1(username, password);
    });

    // Event listener for signup form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = signupForm.querySelector('input[id="username"]').value;
        const email = signupForm.querySelector('input[id="email"]').value;
        const password = signupForm.querySelector('input[id="password"]').value;
        const confirmPassword = signupForm.querySelector('input[id="confirmPassword"]').value;
        register(name, email, password);
        // Reset page to login form
        container.classList.remove("active");
        });
});


function login1(email, password){
    let status="true";

    $.ajax({
        type: 'POST',
        url: "http://localhost:3000/",//Rota
        data: { emailVar: email, passwordVar: password, action: "login" }
    })
        .done(function(response){
            if(response.state == "true"){
                console.log("Login successful!");
                window.location.href = '/Home';
            }else{
                console.log("Login failed!");
                alert('Invalid username or password. Please try again.');
            }
        });
}
function register(name, email, password){
    let status="true";
    $.ajax({
        type: 'POST',
        url: "http://localhost:3000/",//Rota
        data: { emailVar: email, passwordVar: password,nameVar:name, action: "register" }
    })
        .done(function(response){
            if(response.state == "true"){
                console.log("Registration successful!");
                alert('Registration successful! You can now login.');
                window.location.href = '/';
            }else{
                console.log("Registration failed!");
                alert('Email already registered. Please use a different email.');
            }
        });
}
function enterasGuest(){
    window.location.href = '/logout';
    window.location.href = '/Home';
}