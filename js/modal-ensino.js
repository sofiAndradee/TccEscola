// ===== ADICIONE NO FINAL DO SEU js/script.js =====

// Abre e fecha as janelas dos tipos de ensino
(function () {
  document.querySelectorAll('.card[data-modal]').forEach(function (card) {
    function abrir() { document.getElementById(card.dataset.modal).showModal(); }
    card.addEventListener('click', abrir);
    // Permite abrir com Enter ou Espaço (acessibilidade)
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); }
    });
  });

  document.querySelectorAll('dialog.modal-ensino').forEach(function (modal) {
    modal.querySelector('.me-fechar').addEventListener('click', function () { modal.close(); });
    // Clique no fundo escuro também fecha (a tecla Esc já fecha sozinha)
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  });
})();

// Filtro de cursos dentro do modal (funciona em qualquer modal que tenha .me-filtros)
(function () {
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
})();