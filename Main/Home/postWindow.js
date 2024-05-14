// Get the current time
var currentTime = new Date();
var year = currentTime.getFullYear();
var month = ('0' + (currentTime.getMonth() + 1)).slice(-2);
var day = ('0' + currentTime.getDate()).slice(-2);
var hours = ('0' + currentTime.getHours()).slice(-2);
var time = year + "-" + month + "-" + day + "T" + hours;

// Set the value of the time input field
document.getElementById("time").value = time;





// Set the value of the username and email input fields

document.addEventListener('DOMContentLoaded', () => {
    fetch('/Home/Info')
        .then(response => response.json())
        .then(data => {
            document.getElementById("username").value = data.Name;
            document.getElementById("email").value = data.Email;
        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });
});




// Function to submit the post
function submitPost(event) {
    event.preventDefault();

    // Get the post data from the form
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var time = document.getElementById("time").value;
    var cypherType = document.getElementById("cypherType").value;
    var hmacType = document.getElementById("hmacType").value;

    // Get the file
    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];

    // Create FormData object to send file data along with other form data
    var formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('time', time);
    formData.append('cypherType', cypherType);
    formData.append('hmacType', hmacType);

    // Send the post data to the server
    fetch('/Home/Cypher', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit post');
            }
            console.log('Post submitted successfully');
            return response.json(); // Return the response body if needed
        })
        .catch(error => {
            console.error('Error submitting post:', error);
        });
}

// Add event listener to the submit button
document.getElementById("postButton").addEventListener("click", submitPost);

// Function to go back to the home page
function goBack() {
    window.location.href = "/Home";
    console.log("Going back to home page")
}


