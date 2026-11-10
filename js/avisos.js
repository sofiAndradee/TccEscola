// ===== AVISOS DA ESCOLA (faixa abaixo do banner) =====
//
// Os avisos são editados pela gestão em uma planilha do Google Planilhas.
// A planilha tem uma linha por aviso, com estas colunas na primeira linha:
//
//   titulo | texto | link | botao | ativo
//
//   titulo -> título do aviso (ex.: Matrículas abertas 2026)
//   texto  -> mensagem curta
//   link   -> opcional. Pode ser https://..., #contato, mailto: ou tel:
//   botao  -> opcional. Texto do botão (se houver link e o botão estiver vazio, usa "Saiba mais")
//   ativo  -> "sim" mostra o aviso, "não" esconde (também aceita caixa de seleção: marcada = mostra)
//
// COMO PUBLICAR A PLANILHA:
//   Arquivo > Compartilhar > Publicar na Web > escolha a aba e o formato "Valores separados por
//   vírgula (.csv)" > Publicar > copie o link e cole abaixo, entre as aspas.
//   Atenção: o link publicado é público. Coloque na planilha só o que pode aparecer no site.

var URL_AVISOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSu5H-q6KQgWCzpNlDsCCNF6VbzYgKQonpF2x_XbW7lhjpZhpgabQIdjfKl8Ob-hgWi9AdFc7JBfoyi/pub?output=csv"; // EDITE: cole aqui o link CSV da planilha publicada

// Enquanto URL_AVISOS estiver vazio, o site usa este arquivo de exemplo (avisos.csv).
var URL_AVISOS_EXEMPLO = "avisos.csv";

// ---------- Leitura do CSV (aceita aspas, vírgulas e quebras de linha dentro dos campos) ----------
function lerCSV(texto) {
  var linhas = [], linha = [], campo = "", aspas = false;
  texto = texto.replace(/^\uFEFF/, ""); // remove marcador de arquivo (BOM), se existir

  for (var i = 0; i < texto.length; i++) {
    var c = texto[i];
    if (aspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; } // aspas duplas = uma aspa
        else { aspas = false; }
      } else { campo += c; }
    } else if (c === '"') { aspas = true; }
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
    else if (c !== "\r") { campo += c; }
  }
  if (campo !== "" || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

// "Título" -> "titulo", "Botão" -> "botao" (ignora maiúsculas, acentos e espaços)
function normalizar(s) {
  return String(s || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function linhasParaAvisos(linhas) {
  if (linhas.length < 2) return [];
  var cab = linhas[0].map(normalizar);
  var temAtivo = cab.indexOf("ativo") !== -1;

  return linhas.slice(1).map(function (l) {
    var aviso = {};
    cab.forEach(function (nome, i) { aviso[nome] = (l[i] || "").trim(); });
    return aviso;
  }).filter(function (a) {
    if (!a.titulo && !a.texto) return false; // ignora linhas vazias
    if (!temAtivo) return true;
    return ["sim", "s", "true", "verdadeiro", "1", "x"].indexOf(normalizar(a.ativo)) !== -1;
  });
}

// Só aceita links seguros (evita "javascript:" vindo da planilha)
function linkSeguro(url) {
  url = (url || "").trim();
  return /^(https?:\/\/|mailto:|tel:|#)/i.test(url) ? url : "";
}

function criarCard(a) {
  var card = document.createElement("article");
  card.className = "aviso";

  if (a.titulo) {
    var h = document.createElement("h3");
    h.textContent = a.titulo; // textContent: nunca executa código vindo da planilha
    card.appendChild(h);
  }
  if (a.texto) {
    var p = document.createElement("p");
    p.textContent = a.texto;
    card.appendChild(p);
  }

  var href = linkSeguro(a.link);
  if (href) {
    var l = document.createElement("a");
    l.className = "aviso-link";
    l.href = href;
    l.textContent = a.botao || "Saiba mais";
    if (/^https?:/i.test(href)) { l.target = "_blank"; l.rel = "noopener noreferrer"; }
    card.appendChild(l);
  }
  return card;
}

async function carregarAvisos() {
  var area = document.getElementById("avisos");
  if (!area) return;

  try {
    var url = URL_AVISOS || URL_AVISOS_EXEMPLO;
    var resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);

    var avisos = linhasParaAvisos(lerCSV(await resp.text()));
    if (!avisos.length) return; // sem avisos ativos: a faixa continua escondida

    avisos.forEach(function (a) { area.appendChild(criarCard(a)); });
    area.hidden = false;
  } catch (erro) {
    // Se a planilha estiver fora do ar, o site continua normal, só sem a faixa
    console.error("Não foi possível carregar os avisos:", erro);
  }
}

carregarAvisos();
