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
