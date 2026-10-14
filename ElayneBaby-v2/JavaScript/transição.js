// Ordem das páginas, igual à do menu
const ordem = ["index.html", "produtos.html", "sobre.html", "contato.html"];

// Pega só o nome do arquivo de um endereço
function nomeDaPagina(endereco) {
    const arquivo = new URL(endereco, location.href).pathname.split("/").pop();
    return arquivo === "" ? "index.html" : arquivo;
}

// Descobre se estamos avançando ou voltando no menu
function descobrirTipo(origem, destino) {
    const de = ordem.indexOf(nomeDaPagina(origem));
    const para = ordem.indexOf(nomeDaPagina(destino));
    if (de === -1 || para === -1 || de === para) {
        return null; // página fora do menu: usa o efeito padrão
    }
    return para > de ? "avancando" : "voltando";
}

// Página que está SAINDO
window.addEventListener("pageswap", function (evento) {
    if (!evento.viewTransition || !evento.activation) return;
    const tipo = descobrirTipo(location.href, evento.activation.entry.url);
    if (tipo) evento.viewTransition.types.add(tipo);
});

// Página que está ENTRANDO
window.addEventListener("pagereveal", function (evento) {
    if (!evento.viewTransition || !navigation.activation.from) return;
    const tipo = descobrirTipo(navigation.activation.from.url, location.href);
    if (tipo) evento.viewTransition.types.add(tipo);
});