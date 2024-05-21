// Função para criar uma "post" div
function createPost(name, username, text) {
    // Cria a estrutura principal da div post
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
    headerTextH3.innerHTML = `${name} <span class="post__headerSpecial"><span class="material-icons post__badge"> verified </span>@${username}</span>`;
    headerTextDiv.appendChild(headerTextH3);

    headerDiv.appendChild(headerTextDiv);

    // Cria a descrição do post
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'post__headerDescription';
    const descriptionP = document.createElement('p');
    descriptionP.textContent = text;
    descriptionDiv.appendChild(descriptionP);

    // Monta o corpo do post
    bodyDiv.appendChild(headerDiv);
    bodyDiv.appendChild(descriptionDiv);

    // Monta o post
    postDiv.appendChild(avatarDiv);
    postDiv.appendChild(bodyDiv);

    return postDiv;
}

let username = '';
let email = '';
let cyphers = [];

document.addEventListener('DOMContentLoaded', () => {
    // Promessa para buscar as informações do usuário
    const userInfoPromise = fetch('/Home/Info')
        .then(response => response.json())
        .then(data => {
            username = data.Name;
            email = data.Email;
        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });

    // Promessa para buscar as informações dos cyphers
    const cyphersPromise = fetch('/MyCyphers')
        .then(response => response.json())
        .then(data => {
            cyphers = data;
        })
        .catch(error => {
            console.error('Erro ao buscar as informações dos cyphers:', error);
        });

    // Espera até que ambas as promessas sejam concluídas
    Promise.all([userInfoPromise, cyphersPromise]).then(() => {
        // Seleciona o contêiner onde os posts serão inseridos
        const container = document.getElementById('countainer');

        // Cria os posts dinamicamente
        cyphers.forEach(data => {
            const post = createPost(username, email, data);
            container.appendChild(post);
        });
    });
});
