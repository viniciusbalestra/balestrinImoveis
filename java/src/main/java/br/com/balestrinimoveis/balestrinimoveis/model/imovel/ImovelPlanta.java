package br.com.balestrinimoveis.balestrinimoveis.model.imovel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ImovelPlanta extends Imovel{

    private String slogan;
    private String url;

    public ImovelPlanta(ImovelPlantaDTO imovelPlantaDTO) {
        this.slogan = imovelPlantaDTO.slogan();
        this.url = imovelPlantaDTO.url();
    }
}
