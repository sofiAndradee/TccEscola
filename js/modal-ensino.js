// ===== Modais dos tipos de ensino =====

// Carrega o arquivo modais.html e injeta na página
async function carregarModais() {
  var container = document.getElementById('modais-container');
  try {
    var resp = await fetch('modais.html');
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    container.innerHTML = await resp.text();
  } catch (erro) {
    console.error('Não foi possível carregar os modais:', erro);
  }
}

// Abre e fecha as janelas dos tipos de ensino
function iniciarModais() {
  document.querySelectorAll('dialog.modal-ensino').forEach(function (modal) {
    modal.querySelector('.me-fechar').addEventListener('click', function () { modal.close(); });
    // Clique no fundo escuro também fecha (a tecla Esc já fecha sozinha)
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  });
}

// Área do Aluno (janela de login)
function iniciarModalAluno() {
  var btnAutorizado = document.querySelector(".area-restrita");
  var modalAluno = document.querySelector("#modal-aluno");
  var fecharModal = document.querySelector("#fechar-modal");
  var btnEntrar = document.querySelector("#btn-entrar");
  var campoUsuario = document.querySelector("#usuario");
  var campoSenha = document.querySelector("#senha");

  // Se algum elemento não existir (ex.: modais.html não carregou), não faz nada e não dá erro
  if (!btnAutorizado || !modalAluno || !fecharModal || !btnEntrar || !campoUsuario || !campoSenha) return;

  function abrir() {
    modalAluno.style.display = "flex"; // flex => mostra a janela modal
    campoUsuario.focus();
  }

  function fechar() {
    modalAluno.style.display = "none";
    campoSenha.value = ""; // não deixa a senha digitada na tela
  }

  function entrar() {
    var usuario = campoUsuario.value.trim();
    var senha = campoSenha.value;

    // ATENÇÃO: esta verificação roda no navegador, então qualquer pessoa consegue ver
    // o usuário e a senha no código-fonte. Serve só como demonstração. Para proteger
    // algo de verdade, a validação precisa ser feita em um servidor.
    if (usuario === "aluno" && senha === "1234") {
      alert("Login realizado com sucesso!");
      fechar();
    } else {
      alert("Usuário ou senha incorretos!");
    }
  }

  // Abrir (clique ou teclado: Enter / Espaço)
  btnAutorizado.addEventListener("click", function (event) {
    event.preventDefault();
    abrir();
  });
  btnAutorizado.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
  });

  // Fechar: X, clique no fundo escuro ou tecla Esc
  fecharModal.addEventListener("click", fechar);
  fecharModal.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fechar(); }
  });
  modalAluno.addEventListener("click", function (e) { if (e.target === modalAluno) fechar(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalAluno.style.display === "flex") fechar();
  });

  // Entrar: botão ou Enter dentro dos campos
  btnEntrar.addEventListener("click", entrar);
  [campoUsuario, campoSenha].forEach(function (campo) {
    campo.addEventListener("keydown", function (e) { if (e.key === "Enter") entrar(); });
  });
}

// Filtro de cursos dentro do modal (funciona em qualquer modal que tenha .me-filtros)
function iniciarFiltros() {
  document.querySelectorAll('dialog.modal-ensino').forEach(function (modal) {
    var botoes = modal.querySelectorAll('.me-filtro');
    var areas = modal.querySelectorAll('.me-curso');
    if (!botoes.length) return;

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        var filtro = botao.dataset.filtro;
        botoes.forEach(function (b) {
          var ativo = (b === botao);
          b.classList.toggle('ativo', ativo);
          b.setAttribute('aria-pressed', ativo);
        });
        areas.forEach(function (area) {
          area.hidden = !(filtro === 'todos' || area.dataset.curso === filtro);
        });
      });
    });
  });
}

// Os cards já existem no index.html, então podem ser ligados logo de cara
(function () {
  document.querySelectorAll('.card[data-modal]').forEach(function (card) {
    function abrir() {
      var modal = document.getElementById(card.dataset.modal);
      if (modal) modal.showModal();   // se ainda não carregou, não quebra
    }
    card.addEventListener('click', abrir);
    // Permite abrir com Enter ou Espaço (acessibilidade)
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
    });
  });
})();

// Ordem importa: primeiro carrega, depois liga os eventos dos modais
carregarModais().then(function () {
  iniciarModais();
  iniciarFiltros();
  iniciarModalAluno();
});