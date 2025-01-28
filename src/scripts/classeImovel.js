class Imovel {
    id;
    categoria; ///planta, terceiros
    titulo;
    slogan;
    localizacao;
    valor;
    tipo;
    descricao;
    metragem;
    tamanhoAreaConst;
    qtdQuartos;
    qtdBanheiros;
    destaque = false;
    eDisponivel = false;
    fotos;


    constructor () {
        this.id = id;
        this.categoria = categoria; ///planta, terceiros...
        this.titulo = titulo;
        this.slogan = slogan;
        this.localizacao = localizacao;
        this.valor = valor;
        this.tipo = tipo;
        this.descricao = descricao;
        this.metragem = metragem;
        this.tamanhoAreaConst = tamanhoAreaConst;
        this.qtdQuartos = qtdQuartos;
        this.qtdBanheiros = qtdBanheiros;
        this.fotos = fotos;
    };
}