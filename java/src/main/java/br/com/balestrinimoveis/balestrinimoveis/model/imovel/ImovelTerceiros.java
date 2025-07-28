package br.com.balestrinimoveis.balestrinimoveis.model.imovel;

import br.com.balestrinimoveis.balestrinimoveis.model.tipo.TipoImovel;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ImovelTerceiros extends Imovel{

    private BigDecimal valor;
    @Enumerated(EnumType.STRING)
    private TipoImovel tipo;
    private Integer metragem;
    private Integer vagas;
    private Integer quartos;
    private Integer banheiros;

    public ImovelTerceiros(ImovelTerceirosDTO imovelTerceirosDTO) {
        this.valor = imovelTerceirosDTO.valor();
        this.tipo = imovelTerceirosDTO.tipo();
        this.metragem = imovelTerceirosDTO.metragem();
        this.vagas = imovelTerceirosDTO.vagas();
        this.quartos = imovelTerceirosDTO.quartos();
        this.banheiros = imovelTerceirosDTO.banheiros();
    }
}
