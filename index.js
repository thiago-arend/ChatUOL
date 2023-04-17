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

            // atualiza chat com mensagens
            atualizaChatPeriodico();
        });
        promise.catch((err) => {
            console.log("Erro. Usuário deixou a sala!");
            window.location.reload();
        });
    }, 5000);
}

function preparaMensagem() {
    const msg = document.querySelector(".footer input").value;
    console.log(msg)
    enviarMensagem(msg);
}

function enviarMensagem(msg) {
    console.log("clicou");
    const mensagem = {
        from: nomeUsuario,
        to: "Todos", // padrão (nomes de usuário é bônus)
        text: msg,
        type: "message" // ou "private_message" para o bônus
    }
    const promise = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", mensagem);
    promise.then((res) => {
        console.log(res);

        // recupera mensagens e atualiza o chat
        //atualizaChat();

    });
    promise.catch((err) => {
        // em caso de erro, recarrega pagina, pedindo dados novamente
        console.log("Erro. Enviar mensagem falhou!");
        window.location.reload();
    });
}

function atualizaChat() {
    const promise = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
    promise.then((res) => {
        imprimeMensagens(res.data);
    });
    promise.catch((err) => {
        console.log("Erro. Recuperar mensagens falhou!");
        window.location.reload();
    });
}

function atualizaChatPeriodico() {
    let promise;
    setInterval(() => {
        promise = axios.get("https://mock-api.driven.com.br/api/vm/uol/messages");
        promise.then((res) => {
            imprimeMensagens(res.data);
        });
        promise.catch((err) => {
            console.log("Erro. Recuperar mensagens falhou!");
            window.location.reload();
        });
    }, 3000);
}

function imprimeMensagens(mensagens) {
    const chat = document.querySelector(".chat");
    let texto;
    if(mensagens.length > 1){ // se há pelo menos uma mensagem
        mensagens.forEach(m => {
            texto += `<div class="mensagem">
            <p class="mensagem-hora">(${m.time})</p>
            <p class="mensagem-user">${m.from}</p>
            <p class="mensagem-conteudo">${m.text}</p>
            </div>`;
        });
        chat.innerHTML = texto;
    }

}
