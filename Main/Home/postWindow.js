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

    // Get the post data from the form
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var time = document.getElementById("time").value;
    var cypherType = document.getElementById("cypherType").value;
    var hmacType = document.getElementById("hmacType").value;

    // Get the file
    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];

    if (new Date(time) <= new Date() || isNaN(new Date(time))) {
        alert("Please select a correct time");
        return;
    }
    if (file == null) {
        alert("Please select a file to upload");
        return;
    }

    alert("File uploaded successfully, it will be downloaded");

    // Create FormData object to send file data along with other form data
    var formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('time', time);
    formData.append('cypherType', cypherType);
    formData.append('hmacType', hmacType);

    // Send the post data to the server
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
            console.log(response[0]); // This value is the key to encrypt the file

            var encryptionKey = response[0];
            var privateKey = response[1];




            // Read the file as an ArrayBuffer
            var reader = new FileReader();
            reader.onload = function(e) {



            var arrayBuffer = e.target.result;
            var wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

            // Encrypt the file
            var encrypted = cypherType === "CBC" ? CryptoJS.AES.encrypt(wordArray, encryptionKey, { mode: CryptoJS.mode.CBC }).toString() : CryptoJS.AES.encrypt(wordArray, encryptionKey, { mode: CryptoJS.mode.CTR }).toString();

            //create a hmac for the file
            var hmac = CryptoJS.HmacSHA256(encrypted, encryptionKey).toString();

            //combine the hmac and the encrypted file
            encrypted = hmac + encrypted;





            var rsa = new RSAKey();
            rsa.readPrivateKeyFromPEMString(privateKey);





            var signature = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
            signature.init(privateKey);
            signature.updateString(encrypted);
            var rsaSignature = signature.sign();

            encrypted = rsaSignature + encrypted;




            // Create a blob from the encrypted data
            var encryptedBlob = new Blob([encrypted], { type: "application/octet-stream" });


            // Create a link element to download the file
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(encryptedBlob);
            link.download = file.name + ".aes";
            link.click();
            };
            reader.readAsArrayBuffer(file);
        });
}

// Add event listener to the submit button
document.getElementById("postButton").addEventListener("click", submitPost);

// Function to go back to the home page
function goBack() {
    window.location.href = "/Home";
    console.log("Going back to home page");
}
