package br.com.balestrinimoveis.balestrinimoveis.model.endereco;

public record EnderecoDTO(
        String logradouro,
        String bairro,
        String cidade,
        String uf,
        String complemento,
        String numero) {

    public EnderecoDTO(Endereco endereco) {
        this(endereco.getLogradouro(), endereco.getBairro(), endereco.getCidade(), endereco.getUf(), endereco.getComplemento(), endereco.getNumero());
    }
}
