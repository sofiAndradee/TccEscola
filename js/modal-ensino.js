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
});