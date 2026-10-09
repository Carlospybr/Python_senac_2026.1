// ===== Elementos da página =====
const checkboxes = document.querySelectorAll(".btn-check");
const produtos = document.querySelectorAll("[data-idade]");
const todos = document.getElementById("todos");
const semResultados = document.getElementById("sem-resultados");

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
    const valoresDoCard = dadoDoCard.split(" ");
    return marcados.some(function (valor) {
        return valoresDoCard.includes(valor);
    });
}

// O card passa nos dois grupos?
function produtoCombina(produto, idades, sexos) {
    return passaNoGrupo(produto.dataset.idade, idades) &&
        passaNoGrupo(produto.dataset.sexo, sexos);
}

// Mostra/esconde os cards e a mensagem de "nenhum produto"
function atualizarFiltro() {
    const idades = pegarMarcados("idade");
    const sexos = pegarMarcados("sexo");
    let visiveis = 0;

    produtos.forEach(function (produto) {
        if (produtoCombina(produto, idades, sexos)) {
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

// ===== Reação aos cliques =====
checkboxes.forEach(function (caixa) {
    caixa.addEventListener("change", function () {

        if (caixa === todos) {
            // Clicou no "Todos": ele fica marcado e os outros são desmarcados
            todos.checked = true;

            checkboxes.forEach(function (outro) {
                if (outro !== todos) {
                    outro.checked = false;
                }
            });

        } else {
            // Clicou em outro botão: o "Todos" sai
            todos.checked = false;

            // Se não sobrou nenhum marcado, o "Todos" volta
            if (document.querySelectorAll(".btn-check:checked").length === 0) {
                todos.checked = true;
            }
        }

        atualizarFiltro(); // dentro do "change": roda a cada clique
    });
});

// ===== Estado inicial =====
atualizarFiltro();