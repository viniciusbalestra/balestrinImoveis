class Imovel {
    id;
    categoria; ///planta, terceiros
    titulo;
    slogan;
    localizacao;
    valor;
    tipo;
    metragem;
    fotos;
    vagas;
    descricao;
    tamanhoAreaConst;
    qtdQuartos;
    qtdBanheiros;
    fotoCapa;
    url;
    destaque = false;
    eDisponivel = false;

    constructor (id, categoria, titulo, slogan, localizacao, valor, tipo, metragem, fotos, vagas,  descricao, tamanhoAreaConst, qtdQuartos, qtdBanheiros, fotoCapa, url) {
        this.id = id;
        this.categoria = categoria;
        this.titulo = titulo;
        this.slogan = slogan;
        this.localizacao = localizacao;
        this.valor = valor;
        this.tipo = tipo;
        this.descricao = descricao;
        this.metragem = metragem;
        this.tamanhoAreaConst = tamanhoAreaConst;
        this.qtdQuartos = qtdQuartos;
        this.vagas = vagas;
        this.qtdBanheiros = qtdBanheiros;
        this.fotos = fotos;
        this.fotoCapa = fotoCapa;
        this.url = url;
        this.destaque = false;
        this.eDisponivel = false;
    };
}

module.exports = Imovel;