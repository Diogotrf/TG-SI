// Gets the current date and time
var currentTime = new Date();
var year = currentTime.getFullYear();
var month = ('0' + (currentTime.getMonth() + 1)).slice(-2);
var day = ('0' + currentTime.getDate()).slice(-2);
var hours = ('0' + currentTime.getHours()).slice(-2);
var time = year + "-" + month + "-" + day + "T" + hours;

// Sets the current time in the input field
document.getElementById("time").value = time;

// Sets the value of the username and email input fields
document.addEventListener('DOMContentLoaded', () => {
    fetch('/Home/Info')
        .then(response => response.json())
        .then(data => {
            // Redirects to the home page if the user is not logged in
            if (data.Name == '') {
                window.location.href = "/Home";
            }
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

    // Gets the values from the input fields
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var time = document.getElementById("time").value;
    var cypherType = document.getElementById("cypherType").value;
    var hmacType = document.getElementById("hmacType").value;

    // Gets the file from the input field
    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];

    // Validates the input fields
    if (new Date(time) <= new Date() || isNaN(new Date(time))) {
        alert("Please select a correct time");
        return;
    }
    if (file == null) {
        alert("Please select a file to upload");
        return;
    }

    alert("File uploaded successfully, it will be downloaded");

    // Creates a FormData object to send the post data
    var formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('time', time);
    formData.append('cypherType', cypherType);
    formData.append('hmacType', hmacType);

    // Sends the post data to the server
    $.ajax({
        type: 'POST',
        url: "http://localhost:3000/Home/Cypher",
        data: {
            UserName: username,
            Email: email,
            Time: Date.parse(time),
            CypherType: cypherType,
            HMACType: hmacType
        }
    })
        .done(function (response) {
            console.log(response[0]); // This value is the key to encrypt the file that will appear in the main page

            var encryptionKey = response[0];
            var privateKey = response[1];

            // Reads the file as an ArrayBuffer
            var reader = new FileReader();

            // Encrypts the file
            reader.onload = function(e) {
                // Gets the array buffer of the file
                var arrayBuffer = e.target.result;
                var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

                // Encrypts the file
                var encrypted = cypherType === "CBC" ? CryptoJS.AES.encrypt(wordArray, encryptionKey, { mode: CryptoJS.mode.CBC }).toString() : CryptoJS.AES.encrypt(wordArray, encryptionKey, { mode: CryptoJS.mode.CTR }).toString();

                // Calculates its HMAC
                var hmac = hmacType === "256" ? CryptoJS.HmacSHA256(encrypted, encryptionKey).toString() : CryptoJS.HmacSHA512(encrypted, encryptionKey).toString();

                // Appends the HMAC to the encrypted data
                encrypted = hmac + encrypted;

                // Encrypts the key with the user's private key
                var rsa = new RSAKey();
                rsa.readPrivateKeyFromPEMString(privateKey);

                //
                var signature = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
                signature.init(privateKey);
                signature.updateString(encrypted);

                var rsaSignature = signature.sign();

                // Appends the RSA signature to the encrypted data
                encrypted = rsaSignature + encrypted;

                // Creates a blob from the encrypted data
                var encryptedBlob = new Blob([encrypted], { type: "application/octet-stream" });

                // Creates a link to download the encrypted file and automatically clicks on it
                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(encryptedBlob);
                link.download = file.name + ".enc";
                link.click();
            };
            reader.readAsArrayBuffer(file);
        });
}

// Adds an event listener to the post button
document.getElementById("postButton").addEventListener("click", submitPost);

// Function to go back to the home page
function goBack() {
    window.location.href = "/Home";
    console.log("Going back to home page");
}