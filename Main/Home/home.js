//Exemplo para panhar dados da API
//fetch('/Registo/Edit/data')
//    .then(response => response.json())
//    .then(data => {
//        dados=data
//        console.log(data);
//    })
//    .catch(error => {
//        // lidar com o erro, se houver
//        console.log(data)
//        console.log(error);
//    });


sha256 = require('js-sha256');
console.log(sha256.sha256(document.nome.value()+document.secret.value()+document.time.value()));

// Function to create a new post
function createPost() {
    // Open a new window with the form to create a new post
    var popup = window.open("", "Create Post", "width=500,height=500");

    // Write HTML content to the new window
    popup.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Create Post</title>
            <link rel="stylesheet" href="postWindow.css" />
        </head>
        <body>
            <h2>Create a New Post</h2>
            <form>
                <label for="postContent">Post Content:</label><br>
                <textarea id="postContent" name="postContent" rows="4" cols="50"></textarea><br><br>
                <button id ="postButton" onclick="submitPost()">Submit</button>
            </form>
        </body>
        </html>
    `);

    // Define a function to submit the post
    popup.submitPost = function() {
        // Get the post content from the textarea
        var postContent = popup.document.getElementById("postContent").value;

        // Close the pop-up window
        popup.close();

        // Optionally, you can perform further actions with the post content, such as sending it to a server or adding it to the home page
        // For example:
        // console.log("New post content:", postContent);
        // Add the new post to the home page
        addPostToHomePage(postContent);
    };
}

// Function to add the new post to the home page
function addPostToHomePage(postContent) {
    // Create a new post element
    var postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = postContent;

    // Add the new post to the top of the list of posts
    var postsContainer = document.getElementById("postsContainer");
    postsContainer.insertBefore(postElement, postsContainer.firstChild);
}