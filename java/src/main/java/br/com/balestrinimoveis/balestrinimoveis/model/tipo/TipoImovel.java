package br.com.balestrinimoveis.balestrinimoveis.model.tipo;

public enum TipoImovel {
    APARTAMENTO("apartamento"),
    CASA("casa"),
    RURAL("rural"),
    LOTE("lote"),
    COMERCIAL("comercial"),
    TERRENO("terreno"),
    SOBRADO("sobrado");

    private String tipo;

    TipoImovel(String tipo) {
        this.tipo = tipo;
    }
}
