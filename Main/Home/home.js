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


// When post button is clicked, go to the Home/Post
function openPost() {
    window.location.href = "/Home/Post";
}

// Function to make posts
function htmlPosts(username, key, cyphertype, hmactype) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    // Cria a div de avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'post__avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png';
    avatarDiv.appendChild(avatarImg);

    // Cria a div do corpo do post
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'post__body';

    // Cria o cabeçalho do post
    const headerDiv = document.createElement('div');
    headerDiv.className = 'post__header';

    const headerTextDiv = document.createElement('div');
    headerTextDiv.className = 'post__headerText';
    const headerTextH3 = document.createElement('h3');
    headerTextH3.innerHTML = `${username} <span class="material-icons post__badge"> verified </span>`;
    headerTextDiv.appendChild(headerTextH3);

    headerDiv.appendChild(headerTextDiv);

    // Mete a key
    const keyDiv = document.createElement('div');
    keyDiv.className = 'post__headerDescription';
    const keyP = document.createElement('p');
    keyP.textContent = "Cypher Key: " + key;
    keyDiv.appendChild(keyP);

    // Mete o tipo de cifra
    const cyphertypeDiv = document.createElement('div');
    cyphertypeDiv.className = 'post__headerDescription';
    const cyphertypeP = document.createElement('p');
    cyphertypeP.textContent = "Cypher Type: " + cyphertype;
    cyphertypeDiv.appendChild(cyphertypeP);

    // Mete o tipo de hmac
    const hmactypeDiv = document.createElement('div');
    hmactypeDiv.className = 'post__headerDescription';
    const hmactypeP = document.createElement('p');
    hmactypeP.textContent = "HMAC Type: " + hmactype;
    hmactypeDiv.appendChild(hmactypeP);


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

                //NAO ESTA A FUNCIONAR
                //var encryptedData = e.target.result;
                //var textDecoder = new TextDecoder("utf-8");
//
                //var encryptedDataString = textDecoder.decode(encryptedData);
                //var desencryptedData;
                //console.log(encryptedDataString);
                //if (cyphertype === "ECB"){
                //    desencryptedData = CryptoJS.AES.decrypt(encryptedDataString, key);
                //}
                //else{
                //    desencryptedData = CryptoJS.AES.decrypt(encryptedDataString, key, { mode: CryptoJS.mode.CBC });
                //}
                //console.log(desencryptedData.toString());
//
                //var wordArray = CryptoJS.lib.WordArray.create(desencryptedData);
                //var blob = new Blob([wordArray], { type: "application/octet-stream" });
                //var link = document.createElement("a");
                //link.href = URL.createObjectURL(blob);
                //link.download = file.name.replace(".aes", "");
                //link.click();

            };
            reader.readAsArrayBuffer(file);
        };

        //decifrar futuramente




    };
    decypherButton.type = "button";

    // Monta o corpo do post
    bodyDiv.appendChild(headerDiv);
    bodyDiv.appendChild(keyDiv);
    bodyDiv.appendChild(cyphertypeDiv);
    bodyDiv.appendChild(hmactypeDiv);
    bodyDiv.appendChild(decypherButton);

    // Monta o post
    postDiv.appendChild(avatarDiv);
    postDiv.appendChild(bodyDiv);

    return postDiv;
}

    document.addEventListener('DOMContentLoaded', () => {
        fetch('/Home/Info')
            .then(response => response.json())
        .then(data => {
            if (data.Name == '') {
                document.getElementById("username").textContent = 'Guest';
                document.getElementById("email").textContent = 'guest@guest';
                document.getElementById("post_button").style.display = 'none';
                document.getElementById("mycypher_button").style.display = 'none';
                document.getElementById("logout_button").textContent = 'Login';
                document.getElementById("logout_button").className ="decypherBox__decypherButton"


            }
            else {
                document.getElementById("username").textContent = data.Name;
                document.getElementById("email").textContent = data.Email;
                document.getElementById("post_button").style.display = 'block';
            }

        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });
    fetch('/AtualCyphers')
        .then(response => response.json())
        .then(data => {
            //grab data, which is a list of lists, grab each list of the list and call function above
            data.forEach(element => {
                document.getElementById('container').appendChild(htmlPosts(element[0], element[1], element[2], element[3]));
            });
        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });
});