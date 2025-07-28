package br.com.balestrinimoveis.balestrinimoveis.model.imovel;

import br.com.balestrinimoveis.balestrinimoveis.model.categoria.Categoria;
import br.com.balestrinimoveis.balestrinimoveis.model.endereco.Endereco;
import br.com.balestrinimoveis.balestrinimoveis.model.tipo.TipoImovel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Table(name="imoveis")
@Entity(name="Imovel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Imovel {

    @Id
    @GeneratedValue(generator = "uuid2") // Usa um gerador personalizado para UUIDs
    @GenericGenerator(name = "uuid2", strategy = "uuid2") // Define o gerador
    private String id; // O tipo do ID agora é String para armazenar o UUID
    @Enumerated(EnumType.STRING)
    private Categoria categoria;
    private String titulo;
    @Embedded
    private Endereco endereco;
    private String fotos;
    private String capa;
    private String descricao;
    private Boolean destaque;
    private Boolean disponivel;
    private String slogan;
    private String url;
    private BigDecimal valor;
    @Enumerated(EnumType.STRING)
    private TipoImovel tipo;
    private Integer metragem;
    private Integer vagas;
    private Integer quartos;
    private Integer banheiros;

    public Imovel(ImovelDTO imovelDTO) {
        this.id = imovelDTO.id();
        this.categoria = imovelDTO.categoria();
        this.titulo = imovelDTO.titulo();
        this.endereco = imovelDTO.endereco();
        this.fotos = imovelDTO.fotos();
        this.capa = imovelDTO.capa();
        this.descricao = imovelDTO.descricao();
        this.destaque = imovelDTO.destaque();
        this.disponivel = imovelDTO.disponivel();
        this.slogan = imovelDTO.slogan();
        this.url = imovelDTO.url();
        this.valor = imovelDTO.valor();
        this.tipo = imovelDTO.tipo();
        this.metragem = imovelDTO.metragem();
        this.vagas = imovelDTO.vagas();
        this.quartos = imovelDTO.quartos();
        this.banheiros = imovelDTO.banheiros();
    }

    public List<String> getFotosList() {
        if (this.fotos == null || this.fotos.isEmpty() || this.fotos.equals("null")) {
            return new ArrayList<>();
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            return mapper.readValue(this.fotos.trim(), mapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (JsonProcessingException e) {
            System.err.println("Erro ao parsear JSON de fotos da String: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public void setFotosList(List<String> fotosList) {
        if (fotosList == null || fotosList.isEmpty()) {
            this.fotos = null;
            return;
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            this.fotos = mapper.writeValueAsString(fotosList);
        } catch (JsonProcessingException e) {
            System.err.println("Erro ao serializar lista de fotos para String JSON: " + e.getMessage());
            this.fotos = null;
        }
    }
}
