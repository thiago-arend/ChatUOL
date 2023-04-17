axios.defaults.headers.common['Authorization'] = 'jJo7ORw9ajCoGsHMsNZCQBo7';
const input = document.querySelector(".footer input");

// prepara dados para requisição de login do usuário
let nomeUsuario = prompt("Digite seu nome:");
input.focus(); //traz o foco para o input de texto
let usuario = {name: nomeUsuario};
let promise = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", usuario);
let resposta, promiseAux;

input.addEventListener(("keydown"), (event) => { // listener para escutar a tecla enter
    if (event.keyCode === 13){
        preparaMensagem();
    }
})

function loginUsuario() {
    // testa resposta
    promise.then((res) => {
        usuarioLogado(usuario);
    });
    promise.catch((err) => {
        if(err.response.status === 400){
            window.location.reload();
        }

        /*
        OBS.: essa solução comentada parece mais próxima da especificação do problema, 
        mas tive dificuldade em fazer funcionar

        let erro = err.response.status;
        while(erro === 400){ // enquanto já houver usuario logado com esse nome
            nomeUsuario = prompt("Digite seu nome:");
            usuario = {name: nomeUsuario};
            promiseAux = axios.post("https://mock-api.driven.com.br/api/vm/uol/participants", usuario);
            promiseAux.then((resAux) => {
                console.log("sucesso!");
                usuarioLogado(usuario);
            });
            promiseAux.catch((errAux) => {
                erro = errAux.response.status;
            });
        }
        */
    });
}

function usuarioLogado(usuario) {
    let promise;
    setInterval(() => {
        console.log("=== VERIFICA STATUS USUARIO ===")
        promise = axios.post("https://mock-api.driven.com.br/api/vm/uol/status", usuario);
        promise.then((res) => {

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
    const msg = input.value;
    input.value = "";
    input.focus();
    enviarMensagem(msg);
}

function enviarMensagem(msg) {
    if(msg.length > 0) { // se mensagem nao está vazia
        const mensagem = {
            from: nomeUsuario,
            to: "Todos", // padrão (nomes de usuário é bônus)
            text: msg,
            type: "message" // ou "private_message" para o bônus
        }
        const promise = axios.post("https://mock-api.driven.com.br/api/vm/uol/messages", mensagem);
        promise.then((res) => {
    
            // recupera mensagens e atualiza o chat
            atualizaChat();
    
        });
        promise.catch((err) => {
            // em caso de erro, recarrega pagina, pedindo dados novamente
            console.log("Erro. Enviar mensagem falhou!");
            window.location.reload();
        });
    }
}

function atualizaChat() {
    console.log("=== ATUALIZOU CHAT ===")
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
    setInterval(atualizaChat, 3000);
}

function imprimeMensagens(mensagens) {
    const chat = document.querySelector(".chat");
    let texto;
    if(mensagens.length > 1){ // se há pelo menos uma mensagem
        mensagens.forEach(m => {
            // se a mensagem é de status, muda a cor
            if (m.text === "entra na sala..." || m.text === "sai da sala...") {
                texto += `<div class="mensagem mensagem-status">
                <p class="mensagem-hora">(${m.time})</p>
                <p class="mensagem-user">${m.from}</p>
                <p class="mensagem-conteudo">${m.text}</p>
                </div>`;
            } else {
                texto += `<div class="mensagem">
                <p class="mensagem-hora">(${m.time})</p>
                <p class="mensagem-user">${m.from}</p>
                <p class="mensagem-conteudo">${m.text}</p>
                </div>`;
            }
        });
        chat.innerHTML = texto;
    }

}

loginUsuario();
