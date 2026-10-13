// ===== Elementos da página =====
const checkboxes = document.querySelectorAll(".btn-check");
const produtos = document.querySelectorAll("[data-idade]");
const todos = document.getElementById("todos");
const semResultados = document.getElementById("sem-resultados");
const linksCategoria = document.querySelectorAll("a[data-categoria]"); // NOVO
const listaProdutos = document.getElementById("lista-produtos");       // NOVO

// ===== Estado =====
// NOVO: guarda a categoria ativa. "todos" significa "sem restrição de categoria".
let categoriaAtiva = "todos";

// ===== Funções do filtro =====
    
// Quais valores estão marcados em um grupo?
function pegarMarcados(nome) {
    const marcados = document.querySelectorAll('input[name="' + nome + '"]:checked');
    return Array.from(marcados).map(function (caixa) {
        return caixa.value;
    });
}

// NOVO: transforma a categoria ativa numa lista, no mesmo formato dos outros grupos.
// "todos" vira lista vazia (= sem restrição); "pijama" vira ["pijama"].
function categoriaComoLista() {
    if (categoriaAtiva === "todos") {
        return [];
    }
    return [categoriaAtiva];
}

// Um card passa neste grupo?
function passaNoGrupo(dadoDoCard, marcados) {
    if (marcados.length === 0) {
        return true; // nada marcado = sem restrição
    }
    // ALTERADO (segurança): se o card não tiver o atributo, usa texto vazio em vez de dar erro
    const valoresDoCard = (dadoDoCard || "").split(" ");
    return marcados.some(function (valor) {
        return valoresDoCard.includes(valor);
    });
}

// ALTERADO: o card agora precisa passar nos TRÊS grupos (idade, sexo e categoria)
function produtoCombina(produto, idades, sexos, categorias) {
    return passaNoGrupo(produto.dataset.idade, idades) &&
        passaNoGrupo(produto.dataset.sexo, sexos) &&
        passaNoGrupo(produto.dataset.category, categorias);
}

// Mostra/esconde os cards e a mensagem de "nenhum produto"
function atualizarFiltro() {
    const idades = pegarMarcados("idade");
    const sexos = pegarMarcados("sexo");
    const categorias = categoriaComoLista(); // NOVO
    let visiveis = 0;

    produtos.forEach(function (produto) {
        if (produtoCombina(produto, idades, sexos, categorias)) { // ALTERADO
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

// NOVO: "Todos os Produtos" só fica marcado quando NÃO há nenhum filtro ativo
// (nem categoria, nem idade, nem sexo).
function atualizarBotaoTodos() {
    const semFiltros = categoriaAtiva === "todos" &&
        pegarMarcados("idade").length === 0 &&
        pegarMarcados("sexo").length === 0;
    todos.checked = semFiltros;
}

// NOVO: marca no HTML qual cartão de categoria está ativo (aria-current)
function marcarCategoriaAtiva() {
    linksCategoria.forEach(function (link) {
        if (link.dataset.categoria === categoriaAtiva) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

// NOVO: rola suavemente até a lista de produtos
function rolarParaProdutos() {
    if (listaProdutos) {
        listaProdutos.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// ===== Reação aos cliques nos botões de filtro (idade, sexo, todos) =====
checkboxes.forEach(function (caixa) {
    caixa.addEventListener("change", function () {

        if (caixa === todos) {
            // Clicou no "Todos": limpa idade e sexo...
            checkboxes.forEach(function (outro) {
                if (outro !== todos) {
                    outro.checked = false;
                }
            });
            // ...e também a categoria (NOVO)
            categoriaAtiva = "todos";
            marcarCategoriaAtiva();
        }

        // ALTERADO: uma única função decide se o "Todos" fica marcado ou não
        atualizarBotaoTodos();
        atualizarFiltro(); // dentro do "change": roda a cada clique
    });
});

// ===== NOVO: reação aos cliques nos cartões de categoria =====
linksCategoria.forEach(function (link) {
    link.addEventListener("click", function (evento) {
        evento.preventDefault();                    // impede o "#" de mexer na URL
        categoriaAtiva = link.dataset.categoria;    // guarda a categoria escolhida
        marcarCategoriaAtiva();                     // destaca o cartão
        atualizarBotaoTodos();                      // "Todos" sai (ou volta, se for "todos")
        atualizarFiltro();                          // mostra/esconde os produtos
        rolarParaProdutos();                        // leva a pessoa até eles
    });
});

// ===== Estado inicial =====
marcarCategoriaAtiva(); // NOVO
atualizarBotaoTodos();  // NOVO
atualizarFiltro();