package br.com.balestrinimoveis.balestrinimoveis.model.imovel;

import br.com.balestrinimoveis.balestrinimoveis.model.categoria.Categoria;
import br.com.balestrinimoveis.balestrinimoveis.model.endereco.Endereco;
import br.com.balestrinimoveis.balestrinimoveis.model.tipo.TipoImovel;

import java.math.BigDecimal;

public record ImovelDTO(String id,
                        Categoria categoria,
                        String titulo,
                        Endereco endereco,
                        String fotos,
                        String capa,
                        String descricao,
                        Boolean destaque,
                        Boolean disponivel,
                        String slogan,
                        String url,
                        BigDecimal valor,
                        TipoImovel tipo,
                        Integer metragem,
                        Integer vagas,
                        Integer quartos,
                        Integer banheiros) {


    public ImovelDTO(Imovel imovel) {
        this(imovel.getId(), imovel.getCategoria(), imovel.getTitulo(), imovel.getEndereco(), imovel.getFotos(), imovel.getCapa(), imovel.getDescricao(), imovel.getDestaque(),imovel.getDisponivel(), imovel.getSlogan(), imovel.getUrl(), imovel.getValor(), imovel.getTipo(), imovel.getMetragem(), imovel.getVagas(), imovel.getQuartos(), imovel.getBanheiros());
    }

}
