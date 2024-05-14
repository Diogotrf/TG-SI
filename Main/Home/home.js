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

document.addEventListener('DOMContentLoaded', () => {
    fetch('/Home/Info')
        .then(response => response.json())
        .then(data => {
            document.getElementById("username").textContent = data.Name;
            document.getElementById("email").textContent = data.Email;
        })
        .catch(error => {
            console.error('Erro ao buscar as informações do usuário:', error);
        });
});