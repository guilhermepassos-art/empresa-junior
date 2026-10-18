"use strict";

// ========================================
// PRODUTOS DA COLEÇÃO VENTOS
// ========================================

const produtos = {
    "Everest": {
        nome: "Vento do Everest",
        preco: 89.90,
        descricao:
            "Alguns sonhos parecem estar no topo do mundo. " +
            "Inspirado na grandiosidade do Himalaia, o Vento do Everest " +
            "representa a vontade de explorar o desconhecido, superar " +
            "limites e manter por perto a lembrança de tudo aquilo " +
            "que ainda queremos conquistar."
    },

    "Rio de Janeiro": {
        nome: "Brisa do Rio",
        preco: 79.90,
        descricao:
            "Há momentos em que tudo o que precisamos é desacelerar. " +
            "Inspirada no encontro entre o mar, as montanhas e a energia " +
            "carioca, a Brisa do Rio representa a leveza de aproveitar " +
            "o presente e guardar aquilo que faz a vida valer a pena."
    },

    "Santorini": {
        nome: "Vento do Egeu",
        preco: 99.90,
        descricao:
            "Alguns lugares parecem ter sido feitos para nunca serem " +
            "esquecidos. Inspirado nas paisagens de Santorini e no azul " +
            "do mar Egeu, este vento representa a beleza de desacelerar, " +
            "contemplar o mundo e transformar instantes em grandes memórias."
    },

    "Saara": {
        nome: "Vento do Saara",
        preco: 94.90,
        descricao:
            "No deserto, o caminho se refaz a cada hora do dia. " +
            "Inspirado nas dunas de Merzouga e na luz que muda de cor " +
            "ao entardecer, o Vento do Saara representa a coragem de " +
            "seguir em frente mesmo quando a trilha ainda não está desenhada."
    },

    "Patagônia": {
        nome: "Vento da Patagônia",
        preco: 109.90,
        descricao:
            "Existe uma beleza particular nos lugares que exigem esforço. " +
            "Inspirado nos lagos, nas geleiras e nas montanhas do fim do " +
            "mundo, o Vento da Patagônia representa a força de quem " +
            "atravessa o próprio inverno sem perder a direção."
    },

    "Quioto": {
        nome: "Brisa de Quioto",
        preco: 84.90,
        descricao:
            "Há cidades que ensinam a diminuir o passo. " +
            "Inspirada nos caminhos de torii, nos jardins de templo e no " +
            "silêncio das manhãs japonesas, a Brisa de Quioto representa " +
            "a serenidade de quem faz cada coisa no seu tempo."
    }
};


// ========================================
// ESTADO DO SITE
// ========================================

let carrinho = [];
let produtoSelecionado = null;


// ========================================
// ELEMENTOS HTML
// ========================================

const raiz = document.documentElement;
const botaoTema = document.getElementById("botaoTema");

const botaoMenu = document.getElementById("botaoMenu");
const menuPrincipal = document.getElementById("menuPrincipal");

const modal = document.getElementById("modal");
const carrinhoOverlay = document.getElementById("carrinho");

const tituloModal = document.getElementById("tituloModal");
const textoModal = document.getElementById("textoModal");
const precoModal = document.getElementById("precoModal");

const listaCarrinho = document.getElementById("listaCarrinho");
const contadorCarrinho = document.getElementById("contadorCarrinho");
const contadorCarrinhoPainel =
    document.getElementById("contadorCarrinhoPainel");
const totalCarrinho = document.getElementById("totalCarrinho");


// ========================================
// MODO CLARO E MODO ESCURO
// ========================================

function aplicarTema(tema) {
    raiz.setAttribute("data-tema", tema);

    if (botaoTema) {
        const estaEscuro = tema === "escuro";

        botaoTema.textContent = estaEscuro ? "☀" : "☾";
        botaoTema.setAttribute("aria-pressed", String(estaEscuro));
        botaoTema.setAttribute(
            "aria-label",
            estaEscuro ? "Ativar modo claro" : "Ativar modo escuro"
        );
    }

    try {
        localStorage.setItem("ventos-tema", tema);
    } catch (erro) {
        // O navegador pode bloquear o armazenamento local.
        // Nesse caso o tema vale apenas para esta visita.
    }
}

function temaSalvo() {
    try {
        const guardado = localStorage.getItem("ventos-tema");

        if (guardado === "claro" || guardado === "escuro") {
            return guardado;
        }
    } catch (erro) {
        return null;
    }

    return null;
}

function temaInicial() {
    const guardado = temaSalvo();

    if (guardado) {
        return guardado;
    }

    const prefereEscuro = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefereEscuro ? "escuro" : "claro";
}

aplicarTema(temaInicial());

if (botaoTema) {
    botaoTema.addEventListener("click", function () {
        const atual = raiz.getAttribute("data-tema");
        aplicarTema(atual === "escuro" ? "claro" : "escuro");
    });
}

// Acompanha a troca de tema do sistema enquanto o visitante
// ainda não escolheu um modo manualmente.
if (window.matchMedia) {
    const preferencia = window.matchMedia("(prefers-color-scheme: dark)");

    preferencia.addEventListener("change", function (evento) {
        if (!temaSalvo()) {
            aplicarTema(evento.matches ? "escuro" : "claro");
        }
    });
}


// ========================================
// MENU DO CELULAR
// ========================================

function fecharMenu() {
    if (!menuPrincipal || !botaoMenu) return;

    menuPrincipal.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
    botaoMenu.textContent = "\u2630";
}

function abrirMenu() {
    if (!menuPrincipal || !botaoMenu) return;

    menuPrincipal.classList.add("aberto");
    botaoMenu.setAttribute("aria-expanded", "true");
    botaoMenu.setAttribute("aria-label", "Fechar menu");
    botaoMenu.textContent = "\u2715";
}

if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", function () {
        if (menuPrincipal.classList.contains("aberto")) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    });

    // Fecha o menu depois que o visitante escolhe uma seção.
    menuPrincipal.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", fecharMenu);
    });

    // Fecha o menu ao voltar para a largura de computador.
    window.addEventListener("resize", function () {
        if (window.innerWidth > 760) {
            fecharMenu();
        }
    });
}


// ========================================
// FORMATAÇÃO DE PREÇO
// ========================================

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ========================================
// TRAVAR O FUNDO COM AS JANELAS ABERTAS
// ========================================

function ajustarScrollDaPagina() {
    const algumaJanelaAberta =
        modal.classList.contains("ativo") ||
        carrinhoOverlay.classList.contains("ativo");

    document.body.classList.toggle("sem-scroll", algumaJanelaAberta);
}


// ========================================
// ABRIR DETALHES DO PRODUTO
// ========================================

function abrirModal(nomeProduto) {
    // Permite abrir uma janela informativa geral.
    if (nomeProduto === "Ventos") {
        alert(
            "A Ventos transforma a inspiração de destinos " +
            "extraordinários em lembranças para guardar, colecionar " +
            "ou presentear. Explore a coleção e escolha seu destino favorito."
        );
        return;
    }

    const produto = produtos[nomeProduto];

    if (!produto) {
        alert("Não foi possível encontrar esse produto.");
        return;
    }

    produtoSelecionado = nomeProduto;

    tituloModal.textContent = produto.nome;
    textoModal.textContent = produto.descricao;
    precoModal.textContent = formatarPreco(produto.preco);

    modal.classList.add("ativo");
    modal.setAttribute("aria-hidden", "false");
    ajustarScrollDaPagina();

    const botaoAdicionar = document.getElementById("botaoAdicionar");

    if (botaoAdicionar) {
        botaoAdicionar.focus();
    }
}


// ========================================
// FECHAR DETALHES DO PRODUTO
// ========================================

function fecharModal() {
    modal.classList.remove("ativo");
    modal.setAttribute("aria-hidden", "true");
    ajustarScrollDaPagina();
}


// ========================================
// ADICIONAR PRODUTO AO CARRINHO
// ========================================

function adicionarProduto() {
    if (!produtoSelecionado || !produtos[produtoSelecionado]) {
        alert("Escolha um destino antes de adicionar ao carrinho.");
        return;
    }

    const itemExistente = carrinho.find(
        item => item.id === produtoSelecionado
    );

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        const produto = produtos[produtoSelecionado];

        carrinho.push({
            id: produtoSelecionado,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    fecharModal();
    abrirCarrinho();

    mostrarMensagemCarrinho(
        `${produtos[produtoSelecionado].nome} foi adicionado à sua coleção.`
    );
}


// ========================================
// ATUALIZAR CARRINHO
// ========================================

function atualizarCarrinho() {
    const quantidadeTotal = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    const valorTotal = carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
    );

    contadorCarrinho.textContent = quantidadeTotal;
    contadorCarrinhoPainel.textContent = quantidadeTotal;
    totalCarrinho.textContent = formatarPreco(valorTotal);

    listaCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
        const mensagemVazia = document.createElement("p");

        mensagemVazia.className = "carrinho-vazio";
        mensagemVazia.textContent =
            "Sua próxima memória começa aqui. " +
            "Escolha um destino para descobrir qual história combina com você.";

        listaCarrinho.appendChild(mensagemVazia);
        mostrarMensagemCarrinho("");
        return;
    }

    carrinho.forEach(item => {
        const elemento = document.createElement("div");
        elemento.className = "item-carrinho";

        const informacoes = document.createElement("div");
        informacoes.className = "informacoes-item";

        const nome = document.createElement("h3");
        nome.textContent = item.nome;

        const preco = document.createElement("p");
        preco.textContent = formatarPreco(item.preco);

        const subtotal = document.createElement("p");
        subtotal.textContent =
            "Subtotal: " + formatarPreco(item.preco * item.quantidade);

        const controles = document.createElement("div");
        controles.className = "controles-quantidade";

        const botaoDiminuir = document.createElement("button");
        botaoDiminuir.type = "button";
        botaoDiminuir.textContent = "−";
        botaoDiminuir.setAttribute(
            "aria-label",
            `Diminuir quantidade de ${item.nome}`
        );
        botaoDiminuir.addEventListener("click", () => {
            diminuirQuantidade(item.id);
        });

        const quantidade = document.createElement("span");
        quantidade.textContent = item.quantidade;

        const botaoAumentar = document.createElement("button");
        botaoAumentar.type = "button";
        botaoAumentar.textContent = "+";
        botaoAumentar.setAttribute(
            "aria-label",
            `Aumentar quantidade de ${item.nome}`
        );
        botaoAumentar.addEventListener("click", () => {
            aumentarQuantidade(item.id);
        });

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.className = "remover-item";
        botaoRemover.textContent = "Remover";
        botaoRemover.addEventListener("click", () => {
            removerProduto(item.id);
        });

        controles.append(
            botaoDiminuir,
            quantidade,
            botaoAumentar,
            botaoRemover
        );

        informacoes.append(nome, preco, subtotal, controles);
        elemento.appendChild(informacoes);
        listaCarrinho.appendChild(elemento);
    });
}


// ========================================
// AUMENTAR QUANTIDADE
// ========================================

function aumentarQuantidade(idProduto) {
    const item = carrinho.find(item => item.id === idProduto);

    if (!item) return;

    item.quantidade += 1;
    atualizarCarrinho();
}


// ========================================
// DIMINUIR QUANTIDADE
// ========================================

function diminuirQuantidade(idProduto) {
    const item = carrinho.find(item => item.id === idProduto);

    if (!item) return;

    item.quantidade -= 1;

    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(item => item.id !== idProduto);
    }

    atualizarCarrinho();
}


// ========================================
// REMOVER PRODUTO
// ========================================

function removerProduto(idProduto) {
    carrinho = carrinho.filter(item => item.id !== idProduto);
    atualizarCarrinho();
}


// ========================================
// ABRIR E FECHAR CARRINHO
// ========================================

function abrirCarrinho() {
    carrinhoOverlay.classList.add("ativo");
    carrinhoOverlay.setAttribute("aria-hidden", "false");
    ajustarScrollDaPagina();
}

function fecharCarrinho() {
    carrinhoOverlay.classList.remove("ativo");
    carrinhoOverlay.setAttribute("aria-hidden", "true");
    ajustarScrollDaPagina();
}


// ========================================
// MENSAGEM TEMPORÁRIA NO CARRINHO
// ========================================

function mostrarMensagemCarrinho(texto) {
    let mensagem = document.getElementById("mensagemCarrinho");

    if (!mensagem) {
        mensagem = document.createElement("p");
        mensagem.id = "mensagemCarrinho";
        mensagem.setAttribute("role", "status");
        mensagem.style.margin = "12px 0";
        mensagem.style.fontSize = "14px";

        const cabecalho = document.querySelector(".carrinho-cabecalho");

        if (cabecalho) {
            cabecalho.insertAdjacentElement("afterend", mensagem);
        }
    }

    mensagem.textContent = texto;
}


// ========================================
// FINALIZAR PEDIDO - MODO DEMONSTRAÇÃO
// ========================================

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert(
            "Seu carrinho está vazio. " +
            "Escolha um destino da coleção para continuar."
        );
        return;
    }

    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    const resumo = carrinho.map(item =>
        `${item.nome} (${item.quantidade} unidade[s]): ` +
        formatarPreco(item.preco * item.quantidade)
    ).join("\n");

    alert(
        "RESUMO DO SEU PEDIDO - VENTOS\n\n" +
        resumo +
        "\n\nQuantidade de itens: " + quantidade +
        "\nTotal: " + formatarPreco(total) +
        "\n\nEsta é uma demonstração do pedido. " +
        "Nenhum pagamento foi realizado. " +
        "Para receber pedidos reais, é necessário configurar " +
        "um checkout e uma forma de pagamento."
    );
}


// ========================================
// FORMULÁRIO DE NOVIDADES
// ========================================

const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const mensagemFormulario = document.getElementById("mensagem");

if (formulario) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();

        if (!nome || !email) {
            mensagemFormulario.textContent =
                "Preencha seu nome e seu e-mail para continuar.";
            return;
        }

        mensagemFormulario.textContent =
            `Obrigado, ${nome}! O formulário está funcionando, ` +
            "mas o cadastro ainda precisa ser conectado a um serviço " +
            "para que seu e-mail seja realmente registrado.";

        formulario.reset();
    });
}


// ========================================
// ÁREA DE AVALIAÇÃO DOS PRODUTOS
// As avaliações ficam guardadas no navegador do visitante.
// ========================================

const CHAVE_AVALIACOES = "ventos-avaliacoes";

const formAvaliacao = document.getElementById("formAvaliacao");
const campoProdutoAvaliado = document.getElementById("produtoAvaliado");
const campoNomeAvaliacao = document.getElementById("nomeAvaliacao");
const campoComentario = document.getElementById("comentarioAvaliacao");
const mensagemAvaliacao = document.getElementById("mensagemAvaliacao");

const filtroProduto = document.getElementById("filtroProduto");
const listaAvaliacoes = document.getElementById("listaAvaliacoes");
const mediaGeral = document.getElementById("mediaGeral");
const estrelasMedia = document.getElementById("estrelasMedia");
const totalAvaliacoes = document.getElementById("totalAvaliacoes");

let avaliacoes = [];

// Avaliações de exemplo, para a área não começar vazia.
const avaliacoesExemplo = [
    {
        id: "exemplo-1",
        produto: "Vento do Everest",
        nota: 5,
        nome: "Marina A.",
        comentario:
            "Comprei para marcar uma mudança de cidade. " +
            "A etiqueta com as coordenadas foi o detalhe que me conquistou.",
        data: "2026-09-28T14:20:00.000Z"
    },
    {
        id: "exemplo-2",
        produto: "Brisa de Quioto",
        nota: 4,
        nome: "Caio R.",
        comentario:
            "Presenteei minha irmã e ela entendeu a ideia na hora. " +
            "A embalagem poderia ser um pouco mais protegida para envio.",
        data: "2026-10-05T09:40:00.000Z"
    }
];


function carregarAvaliacoes() {
    try {
        const guardado = localStorage.getItem(CHAVE_AVALIACOES);

        if (!guardado) {
            return avaliacoesExemplo.slice();
        }

        const lista = JSON.parse(guardado);

        return Array.isArray(lista) ? lista : [];
    } catch (erro) {
        return avaliacoesExemplo.slice();
    }
}

function salvarAvaliacoes() {
    try {
        localStorage.setItem(CHAVE_AVALIACOES, JSON.stringify(avaliacoes));
    } catch (erro) {
        // Sem armazenamento disponível, as avaliações valem
        // apenas enquanto a página estiver aberta.
    }
}

function desenharEstrelas(nota) {
    const cheias = Math.round(nota);

    return "★".repeat(cheias) + "☆".repeat(5 - cheias);
}

function formatarData(textoData) {
    const data = new Date(textoData);

    if (isNaN(data.getTime())) {
        return "";
    }

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function atualizarResumoAvaliacoes() {
    if (!mediaGeral) return;

    if (avaliacoes.length === 0) {
        mediaGeral.textContent = "0,0";
        estrelasMedia.textContent = "☆☆☆☆☆";
        totalAvaliacoes.textContent = "Nenhuma avaliação registrada ainda.";
        return;
    }

    const soma = avaliacoes.reduce(
        (total, item) => total + Number(item.nota),
        0
    );

    const media = soma / avaliacoes.length;

    mediaGeral.textContent = media.toFixed(1).replace(".", ",");
    estrelasMedia.textContent = desenharEstrelas(media);

    totalAvaliacoes.textContent = avaliacoes.length === 1
        ? "1 avaliação registrada"
        : `${avaliacoes.length} avaliações registradas`;
}

function mostrarAvaliacoes() {
    if (!listaAvaliacoes) return;

    const filtro = filtroProduto ? filtroProduto.value : "todos";

    const visiveis = avaliacoes
        .filter(item => filtro === "todos" || item.produto === filtro)
        .slice()
        .sort((a, b) => new Date(b.data) - new Date(a.data));

    listaAvaliacoes.innerHTML = "";

    if (visiveis.length === 0) {
        const vazio = document.createElement("p");

        vazio.className = "sem-avaliacoes";
        vazio.textContent = filtro === "todos"
            ? "Ainda não há avaliações. A primeira pode ser a sua."
            : "Esse destino ainda não recebeu avaliações.";

        listaAvaliacoes.appendChild(vazio);
        return;
    }

    visiveis.forEach(item => {
        const bloco = document.createElement("article");
        bloco.className = "avaliacao-item";

        const cabecalho = document.createElement("div");
        cabecalho.className = "avaliacao-cabecalho";

        const produto = document.createElement("h3");
        produto.textContent = item.produto;

        const nota = document.createElement("p");
        nota.className = "avaliacao-nota";
        nota.textContent = desenharEstrelas(item.nota);
        nota.setAttribute("aria-label", `Nota ${item.nota} de 5`);

        cabecalho.append(produto, nota);

        const meta = document.createElement("p");
        meta.className = "avaliacao-meta";
        meta.textContent = `${item.nome} · ${formatarData(item.data)}`;

        const comentario = document.createElement("p");
        comentario.className = "avaliacao-comentario";
        comentario.textContent = item.comentario;

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.className = "remover-avaliacao";
        botaoRemover.textContent = "Remover";
        botaoRemover.setAttribute(
            "aria-label",
            `Remover avaliação de ${item.nome}`
        );
        botaoRemover.addEventListener("click", () => {
            removerAvaliacao(item.id);
        });

        bloco.append(cabecalho, meta, comentario, botaoRemover);
        listaAvaliacoes.appendChild(bloco);
    });
}

function removerAvaliacao(idAvaliacao) {
    avaliacoes = avaliacoes.filter(item => item.id !== idAvaliacao);

    salvarAvaliacoes();
    atualizarResumoAvaliacoes();
    mostrarAvaliacoes();

    if (mensagemAvaliacao) {
        mensagemAvaliacao.textContent =
            "Avaliação removida deste navegador.";
    }
}

if (formAvaliacao) {
    formAvaliacao.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const notaEscolhida = document.querySelector(
            "input[name='nota']:checked"
        );

        const produto = campoProdutoAvaliado.value;
        const nome = campoNomeAvaliacao.value.trim();
        const comentario = campoComentario.value.trim();

        if (!produto) {
            mensagemAvaliacao.textContent =
                "Escolha qual vento você quer avaliar.";
            campoProdutoAvaliado.focus();
            return;
        }

        if (!notaEscolhida) {
            mensagemAvaliacao.textContent =
                "Escolha uma nota de 1 a 5 estrelas.";
            return;
        }

        if (!nome || !comentario) {
            mensagemAvaliacao.textContent =
                "Preencha seu nome e seu comentário para publicar.";
            return;
        }

        avaliacoes.push({
            id: "av-" + Date.now(),
            produto: produto,
            nota: Number(notaEscolhida.value),
            nome: nome,
            comentario: comentario,
            data: new Date().toISOString()
        });

        salvarAvaliacoes();
        atualizarResumoAvaliacoes();

        if (filtroProduto) {
            filtroProduto.value = "todos";
        }

        mostrarAvaliacoes();

        formAvaliacao.reset();
        mensagemAvaliacao.textContent =
            `Obrigado, ${nome}! Sua avaliação já aparece na lista.`;
    });
}

if (filtroProduto) {
    filtroProduto.addEventListener("change", mostrarAvaliacoes);
}


// ========================================
// FECHAR JANELAS CLICANDO FORA DO CONTEÚDO
// ========================================

modal.addEventListener("click", function(evento) {
    if (evento.target === modal) {
        fecharModal();
    }
});

carrinhoOverlay.addEventListener("click", function(evento) {
    if (evento.target === carrinhoOverlay) {
        fecharCarrinho();
    }
});


// ========================================
// FECHAR JANELAS COM A TECLA ESC
// ========================================

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        fecharModal();
        fecharCarrinho();
        fecharMenu();
    }
});


// ========================================
// INICIALIZAÇÃO
// ========================================

atualizarCarrinho();

avaliacoes = carregarAvaliacoes();
atualizarResumoAvaliacoes();
mostrarAvaliacoes();