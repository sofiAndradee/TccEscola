// FORMULÁRIO DE CONTATO
const formulario = document.querySelector(".contact-form");

formulario.addEventListener("submit", function(event) {
//addEventListener => Espera uma ação do usuário
//submit => Espera o usuário enviar o formulário
    event.preventDefault();

    const nome = formulario.querySelector('input[type="text"]').value;
    const email = formulario.querySelector('input[type="email"]').value;
    const telefone = formulario.querySelector('input[type="tel"]').value;
    const serie = formulario.querySelector("select").value;
//querySelect => Procura um elemento no HTML
//value => Pega o que foi digitado
    alert(
        "Olá, " + nome + "! Recebemos sua solicitação.\n\n" +
        "Nome: " + nome +
        "\nE-mail: " + email +
        "\nTelefone: " + telefone +
        "\nSérie: " + serie
    );

    formulario.reset();
});

// ÁREA DO ALUNO

const btnAluno = document.querySelector("#btn-aluno");
const modalAluno = document.querySelector("#modal-aluno");
const fecharModal = document.querySelector("#fechar-modal");
const btnEntrar = document.querySelector("#btn-entrar");

// ABRIR A JANELA
btnAluno.addEventListener("click", function(event) {
//click => Espera o usuário clicar no botão
    event.preventDefault();

    modalAluno.style.display = "flex";
//flex => mostra a janela modal
});

// FECHAR A JANELA
fecharModal.addEventListener("click", function() {

    modalAluno.style.display = "none";
//none => esconde a janela modal
});

// FAZER LOGIN
btnEntrar.addEventListener("click", function() {
//Quando o usuário clicar em Entrar, execute esta função.
    const usuario = document.querySelector("#usuario").value;
//Procura o campo #usuario e pega o que foi digitado.   
    const senha = document.querySelector("#senha").value;
//Procura o campo #senha e pega o que foi digitado.
    if (usuario === "aluno" && senha === "1234") {

        alert("Login realizado com sucesso!");

    } else {

        alert("Usuário ou senha incorretos!");

    }
//if/else => Condição para verificar se o usuário e senha estão corretos
});