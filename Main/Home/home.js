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


// Function to redirect the user to the post page
function openPost() {
    window.location.href = "/Home/Post";
}

// Function to handle all the posts and everything related to them
function htmlPosts(username, key, cyphertype, hmactype) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    // Creates the avatar div
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'post__avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png';
    avatarDiv.appendChild(avatarImg);

    // Creates the body div
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'post__body';

    // Creates the post header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'post__header';
    const headerTextDiv = document.createElement('div');
    headerTextDiv.className = 'post__headerText';
    const headerTextH3 = document.createElement('h3');
    headerTextH3.innerHTML = `${username} <span class="material-icons post__badge"> verified </span>`;

    headerTextDiv.appendChild(headerTextH3);
    headerDiv.appendChild(headerTextDiv);

    // Handles the key
    const keyDiv = document.createElement('div');
    keyDiv.className = 'post__headerDescription';
    const keyP = document.createElement('p');
    keyP.textContent = "Cypher Key: " + key;
    keyDiv.appendChild(keyP);

    // Handles the cypher type
    const cyphertypeDiv = document.createElement('div');
    cyphertypeDiv.className = 'post__headerDescription';
    const cyphertypeP = document.createElement('p');
    cyphertypeP.textContent = "Cypher Type: " + cyphertype;
    cyphertypeDiv.appendChild(cyphertypeP);

    // Handles the hmac type
    const hmactypeDiv = document.createElement('div');
    hmactypeDiv.className = 'post__headerDescription';
    const hmactypeP = document.createElement('p');
    hmactypeP.textContent = "HMAC Type: " + hmactype;
    hmactypeDiv.appendChild(hmactypeP);

    // Creates the decypher button
    const decypherButton = document.createElement('button');
    decypherButton.className = 'decypherBox__decypherButton';
    decypherButton.textContent = "Decypher";
    decypherButton.id = "decypher_button";
    decypherButton.onclick = function () {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.click();
        fileInput.onchange = function () {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {

                // RSA public key
                var rsaPublicKey = "-----BEGIN PUBLIC KEY-----"+
                    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyH9GdTsMIJoDNz4olC+6"+
                    "sDf71y+6qUYvvc9nJMGKx+Ys/2r9bGa/3pimHgK88eoMEHv1io/CNQCyjJ5Vhe5C"+
                    "ZmwdGT6gmjYnQzmbYwtM8kYKUckJBpSFoOTNdsEaS6TY+hhV1q2LLhpIF2m7M3Sb"+
                    "mWdRemlawUM62u8m5G1Uxz9645tMqXeEfuoTbUW45+/Tif5tktn/DunzvI8ay18g"+
                    "lHDx+nI+7z9BWzOxqhst3gXhE78xNImw2LXRZtv3LzTcV18Q966BdqT6OdvSPvTy"+
                    "Y/gLVzzB4nlLZYPnEcIlgAMs3+SqtxIYJc4o0cLLb43kueEnOQ8nSFTF9Q9OtErk"+
                    "oQIDAQAB"+
                    "-----END PUBLIC KEY-----";

                // Read the file as an ArrayBuffer and decrypt it
                var encryptedData = e.target.result;
                var textDecoder = new TextDecoder("utf-8");
                var encryptedDataString = textDecoder.decode(encryptedData);

                // RSA signature verification
                var rsaSignatureLength = 512; // Signature length for 4096-bit RSA key
                var receivedRsaSignature = encryptedDataString.substring(0, rsaSignatureLength);
                var combinedData = encryptedDataString.substring(rsaSignatureLength);

                var rsa = new KJUR.crypto.Signature({ "alg": "SHA256withRSA" });
                rsa.init(rsaPublicKey);
                rsa.updateString(combinedData);
                var isValidSignature = rsa.verify(receivedRsaSignature);

                if (!isValidSignature) {
                    alert("RSA signature verification failed! Data integrity and authenticity compromised.");
                    return;
                }


                // HMAC verification
                var hmaclength = hmactype === '256' ? 64 : 128;
                var hmac = combinedData.substring(0, hmaclength);
                encryptedDataString = combinedData.substring(hmaclength);

                var calculatedHmac = CryptoJS.HmacSHA256(encryptedDataString, key).toString();
                if (calculatedHmac !== hmac) {
                    alert("HMAC is not valid");
                    return;
                }

                // Decrypt the data
                var desencryptedData;
                if (cyphertype === 'CBC') {
                    desencryptedData = CryptoJS.AES.decrypt(encryptedDataString, key, { mode: CryptoJS.mode.CBC });
                    desencryptedData = desencryptedData.toString(CryptoJS.enc.Utf8);
                }
                else {
                    desencryptedData = CryptoJS.AES.decrypt(encryptedDataString, key, { mode: CryptoJS.mode.CTR });
                    desencryptedData = desencryptedData.toString(CryptoJS.enc.Utf8);
                }

                desencryptedData = desencryptedData.toString(CryptoJS.enc.Utf8);


                // Create a blob from the decrypted data
                var blob = new Blob([desencryptedData], { type: 'text/plain' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = file.name.replace('.enc', '');
                a.click();
            };

            // Read the file as an ArrayBuffer
            reader.readAsArrayBuffer(file);
        };
    };
    decypherButton.type = "button";

    // Handles the post's structure
    bodyDiv.appendChild(headerDiv);
    bodyDiv.appendChild(keyDiv);
    bodyDiv.appendChild(cyphertypeDiv);
    bodyDiv.appendChild(hmactypeDiv);
    bodyDiv.appendChild(decypherButton);

    // Handles the post
    postDiv.appendChild(avatarDiv);
    postDiv.appendChild(bodyDiv);

    return postDiv;
}

// Function to handle the user's information
document.addEventListener('DOMContentLoaded', () => {

    // Fetch the user's information
    fetch('/Home/Info')
        .then(response => response.json())
        .then(data => {
            // If the user is not logged in, show the guest information
            if (data.Name == '') {
                document.getElementById("username").textContent = 'Guest';
                document.getElementById("email").textContent = 'guest@guest';
                document.getElementById("post_button").style.display = 'none';
                document.getElementById("mycypher_button").style.display = 'none';
                document.getElementById("logout_button").textContent = 'Login';
                document.getElementById("logout_button").className ="decypherBox__decypherButton"
            }
            // If the user is logged in, show the user's information
            else {
                document.getElementById("username").textContent = data.Name;
                document.getElementById("email").textContent = data.Email;
                document.getElementById("post_button").style.display = 'block';
            }

        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });
    // Fetch the user's cyphers
    fetch('/AtualCyphers')
        .then(response => response.json())
        .then(data => {
            // Grab all the posts from the server
            data.forEach(element => {
                document.getElementById('container').appendChild(htmlPosts(element[0], element[1], element[2], element[3]));
            });
        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });
});