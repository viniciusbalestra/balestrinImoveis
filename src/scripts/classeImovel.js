class Imovel {
    idImovel;
    tituloImovel;
    descricaoImovel;
    localizacaoImovel;
    tamanhoTerrenoImovel;
    tamanhoAreaConstImovel;
    qtdQuartosImovel;
    qtdBanheirosImovel;
    valorImovel;
    destaqueImovel;
    eDisponivel;

    constructor (idImovel, tituloImovel, descricaoImovel, localizacaoImovel, tamanhoTerrenoImovel, tamanhoAreaConstImovel, qtdQuartosImovel, qtdBanheirosImovel, valorImovel, destaqueImovel, eDisponivel) {
        this.idImovel = idImovel;
        this.tituloImovel = tituloImovel;
        this.descricaoImovel = descricaoImovel;
        this.localizacaoImovel = localizacaoImovel;
        this.tamanhoTerrenoImovel = tamanhoTerrenoImovel;
        this.tamanhoAreaConstImovel = tamanhoAreaConstImovel;
        this.qtdQuartosImovel = qtdQuartosImovel;
        this.qtdBanheirosImovel = qtdBanheirosImovel;
        this.valorImovel = valorImovel;
        this.destaqueImovel = destaqueImovel;
        this.eDisponivel = eDisponivel;
    };
}