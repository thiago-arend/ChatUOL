axios.defaults.headers.common['Authorization'] = 'jJo7ORw9ajCoGsHMsNZCQBo7';

// entrar na sala
let nomeUsuario = prompt("Digite seu nome:");
let usuario = {name: nomeUsuario};
let promise = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", usuario);
let resposta, promiseAux;

// testa resposta
promise.then((res) => {
    resposta = res.status;
    while(resposta === 400){ // enquanto já houver usuario logado com esse nome
        nomeUsuario = prompt("Digite seu nome:");
        usuario = {name: nomeUsuario};
        promiseAux = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", usuario);
        promiseAux.then((resAux) => {
            resposta = resAux.status;
            res = resAux;
        });
    }
    console.log(res);

    //usuario logado com sucesso
    usuarioLogado(usuario);
});
promise.catch((err) => {
    // em caso de erro, recarrega pagina, pedindo dados novamente
    console.log("Erro ao tentar conectar com o servidor!");
    window.location.reload();
});

function usuarioLogado(usuario) {
    let promise;
    setInterval(() => {
        promise = axios.post("https://mock-api.driven.com.br/api/vm/uol/status", usuario);
        promise.then((res) => {
            console.log(res);
        });
        promise.catch((err) => {
            console.log("Erro. Usuário deixou a sala!");
            window.location.reload();
        });
    }, 5000);
}


