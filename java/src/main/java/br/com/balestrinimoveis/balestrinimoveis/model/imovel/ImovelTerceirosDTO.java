package br.com.balestrinimoveis.balestrinimoveis.model.imovel;

import br.com.balestrinimoveis.balestrinimoveis.model.tipo.TipoImovel;

import java.math.BigDecimal;

public record ImovelTerceirosDTO(BigDecimal valor,
                                 TipoImovel tipo,
                                 Integer metragem,
                                 Integer vagas,
                                 Integer quartos,
                                 Integer banheiros) {
}
