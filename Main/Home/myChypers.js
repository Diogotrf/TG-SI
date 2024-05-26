// Function to create a post
function createPost(name, username, text) {
    // Creates the post div
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
    headerTextH3.innerHTML = `${name} <span class="post__headerSpecial"><span class="material-icons post__badge"> verified </span>${username}</span>`;
    headerTextDiv.appendChild(headerTextH3);

    headerDiv.appendChild(headerTextDiv);

    // Creates the description div
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'post__headerDescription';
    const descriptionP = document.createElement('p');
    descriptionP.textContent = text;
    descriptionDiv.appendChild(descriptionP);

    // Handles the post header and description
    bodyDiv.appendChild(headerDiv);
    bodyDiv.appendChild(descriptionDiv);

    // Handles the post body
    postDiv.appendChild(avatarDiv);
    postDiv.appendChild(bodyDiv);

    return postDiv;
}

// Global variables to store the user information and cyphers
let username = '';
let email = '';
let cyphers = [];

// Event listener to load the posts when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Handles the user information
    const userInfoPromise = fetch('/Home/Info')
        .then(response => response.json())
        .then(data => {
            // Redirects to the home page if the user is not logged in
            if (data.Name == '') {
                window.location.href = "/Home";
            }
            username = data.Name;
            email = data.Email;
        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });

    // Handles the cyphers information
    const cyphersPromise = fetch('/MyCyphers')
        .then(response => response.json())
        .then(data => {
            cyphers = data;
        })
        .catch(error => {
            console.error('Erro ao buscar as informações dos cyphers:', error);
        });

    // Waits for both promises to be resolved
    Promise.all([userInfoPromise, cyphersPromise]).then(() => {
        // Seleciona o contêiner onde os posts serão inseridos
        const container = document.getElementById('countainer');

        // Creates the posts dynamically (one post for each cypher)
        cyphers.forEach(data => {
            const post = createPost(username, email, data);
            container.appendChild(post);
        });
    });

    // Event listener for the home button
    const homeButton = document.getElementById('homeButton');
    homeButton.addEventListener('click', () => {
        window.location.href = '/home'; // Substitua '/home' pelo URL correto da sua página inicial
    });
});