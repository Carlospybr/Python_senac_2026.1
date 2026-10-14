// ===== Elementos da página =====
const checkboxes = document.querySelectorAll(".btn-check");
const produtos = document.querySelectorAll("[data-idade]");
const todos = document.getElementById("todos");
const semResultados = document.getElementById("sem-resultados");
const linksCategoria = document.querySelectorAll("a[data-categoria]");

// ===== Estado =====
// Lista das categorias ativas. Lista vazia = sem restrição de categoria.
let categoriasAtivas = [];

// ===== Funções do filtro =====

// Quais valores estão marcados em um grupo?
function pegarMarcados(nome) {
    const marcados = document.querySelectorAll('input[name="' + nome + '"]:checked');
    return Array.from(marcados).map(function (caixa) {
        return caixa.value;
    });
}

// Um card passa neste grupo?
function passaNoGrupo(dadoDoCard, marcados) {
    if (marcados.length === 0) {
        return true; // nada marcado = sem restrição
    }
    // Segurança: se o card não tiver o atributo, usa texto vazio em vez de dar erro
    const valoresDoCard = (dadoDoCard || "").split(" ");
    return marcados.some(function (valor) {
        return valoresDoCard.includes(valor);
    });
}

// O card precisa passar nos TRÊS grupos (idade, sexo e categoria)
function produtoCombina(produto, idades, sexos, categorias) {
    return passaNoGrupo(produto.dataset.idade, idades) &&
        passaNoGrupo(produto.dataset.sexo, sexos) &&
        passaNoGrupo(produto.dataset.category, categorias);
}

// Mostra/esconde os cards e a mensagem de "nenhum produto"
function atualizarFiltro() {
    const idades = pegarMarcados("idade");
    const sexos = pegarMarcados("sexo");
    const categorias = categoriasAtivas;
    let visiveis = 0;

    produtos.forEach(function (produto) {
        if (produtoCombina(produto, idades, sexos, categorias)) {
            produto.classList.remove("d-none");
            visiveis++;
        } else {
            produto.classList.add("d-none");
        }
    });

    if (visiveis === 0) {
        semResultados.classList.remove("d-none");
    } else {
        semResultados.classList.add("d-none");
    }
}

// "Todos os Produtos" só fica marcado quando NÃO há nenhum filtro ativo
// (nem categoria, nem idade, nem sexo).
function atualizarBotaoTodos() {
    const semFiltros = categoriasAtivas.length === 0 &&
        pegarMarcados("idade").length === 0 &&
        pegarMarcados("sexo").length === 0;
    todos.checked = semFiltros;
}

// O card está ativo? O card "todos" fica ativo quando a lista está vazia.
function cardEstaAtivo(categoria) {
    if (categoria === "todos") {
        return categoriasAtivas.length === 0;
    }
    return categoriasAtivas.includes(categoria);
}

function marcarCategoriaAtiva() {
    linksCategoria.forEach(function (link) {
        if (cardEstaAtivo(link.dataset.categoria)) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// Desmarca idade, sexo e categorias (o botão "Todos" é tratado por atualizarBotaoTodos)
function limparFiltros() {
    checkboxes.forEach(function (caixa) {
        if (caixa !== todos) {
            caixa.checked = false;
        }
    });
    categoriasAtivas = [];
}

// Liga/desliga uma categoria, como um interruptor
function alternarCategoria(categoria) {
    if (categoria === "todos") {
        limparFiltros();
        return;
    }
    if (categoriasAtivas.includes(categoria)) {
        categoriasAtivas = categoriasAtivas.filter(function (item) {
            return item !== categoria;
        });
    } else {
        categoriasAtivas.push(categoria);
    }
}

// ===== Reação aos cliques nos botões de filtro (idade, sexo, todos) =====
checkboxes.forEach(function (caixa) {
    caixa.addEventListener("change", function () {

        if (caixa === todos) {
            // Clicou no "Todos": limpa idade, sexo e categorias
            limparFiltros();
            marcarCategoriaAtiva();
        }

        // Uma única função decide se o "Todos" fica marcado ou não
        atualizarBotaoTodos();
        atualizarFiltro(); // dentro do "change": roda a cada clique
    });
});

// ===== Reação aos cliques nos cartões de categoria =====
linksCategoria.forEach(function (link) {
    link.addEventListener("click", function (evento) {
        evento.preventDefault();                    // impede o "#" de mexer na URL
        alternarCategoria(link.dataset.categoria);  // liga/desliga a categoria
        marcarCategoriaAtiva();                     // destaca os cartões
        atualizarBotaoTodos();                      // "Todos" sai (ou volta)
        atualizarFiltro();                          // mostra/esconde os produtos
    });
});

// ===== Estado inicial =====
marcarCategoriaAtiva();
atualizarBotaoTodos();
atualizarFiltro();