package br.com.balestrinimoveis.balestrinimoveis.model.categoria;

public enum Categoria {
    PLANTA("planta"),
    TERCEIROS("terceiros");

    private String categoria;

    private Categoria(String categoria) {
        this.categoria = categoria;
    }
}
