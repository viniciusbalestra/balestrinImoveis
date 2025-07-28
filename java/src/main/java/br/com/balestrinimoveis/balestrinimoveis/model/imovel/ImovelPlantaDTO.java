package br.com.balestrinimoveis.balestrinimoveis.model.imovel;

public record ImovelPlantaDTO(String slogan,
                              String url) {

    public ImovelPlantaDTO(ImovelPlanta imovelPlanta) {
        this(imovelPlanta.getSlogan(), imovelPlanta.getUrl());
    }
}
