package br.com.balestrinimoveis.balestrinimoveis.service;

import br.com.balestrinimoveis.balestrinimoveis.model.FotosDTO;
import br.com.balestrinimoveis.balestrinimoveis.model.categoria.Categoria;
import br.com.balestrinimoveis.balestrinimoveis.model.endereco.Endereco;
import br.com.balestrinimoveis.balestrinimoveis.model.imovel.Imovel;
import br.com.balestrinimoveis.balestrinimoveis.model.imovel.ImovelDTO;
import br.com.balestrinimoveis.balestrinimoveis.repository.ImovelRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ImovelService {

    @Autowired
    private ImovelRepository repository;
    private S3Service s3Service;
    private ObjectMapper objectMapper;

    public ResponseEntity<Page<ImovelDTO>> listarImoveisPorCategoria(Pageable paginacao) {

        List<Imovel> imoveisPLanta = repository.findRandom4Imoveis(Categoria.PLANTA);

        List<Imovel> imoveisTerceiros = repository.findRandom4Imoveis(Categoria.TERCEIROS);

        List<Imovel> listaImoveis = new ArrayList<>();
        listaImoveis.addAll(imoveisPLanta);
        listaImoveis.addAll(imoveisTerceiros);

        List<ImovelDTO> listaImoveisDTO = listaImoveis
                .stream()
                .map(ImovelDTO::new)
                .toList();

        Page<ImovelDTO> page = new PageImpl<>(listaImoveisDTO, paginacao, listaImoveis.size());

        return ResponseEntity.ok( page);
    }

    public ResponseEntity<Page<ImovelDTO>> listarTodosImoveis(Pageable paginacao) {

        var imoveis = repository.findAll(paginacao);

        Page<ImovelDTO> imoveisDTO = imoveis
                .map(ImovelDTO::new);

        return ResponseEntity.ok(imoveisDTO);
    }

    public ResponseEntity<Page<ImovelDTO>> listar1Categoria(Categoria categoria, Pageable paginacao) {
        List<Imovel> imoveis = repository.findByCategoria(categoria);

        List<ImovelDTO> listaImoveisDTO = imoveis
                .stream()
                .map(ImovelDTO::new)
                .toList();

        Page<ImovelDTO> page = new PageImpl<>(listaImoveisDTO, paginacao, imoveis.size());

        return ResponseEntity.ok( page);
    }

    @Transactional
    public ResponseEntity<ImovelDTO> cadastrar(String dados, UriComponentsBuilder uriBuilder) throws JsonProcessingException {

        var imovel = objectMapper.readValue(dados, Imovel.class);

        imovel.setFotos(null);
        imovel.setCapa(null);

        Imovel imovelSalvo = repository.save(imovel);

        ImovelDTO imovelDTO = new ImovelDTO(imovelSalvo);

        URI uri = uriBuilder.path("/imoveis/{id}").buildAndExpand(imovelDTO.id()).toUri();


        return ResponseEntity.created(uri).body(imovelDTO);
    }

    @Transactional
    public List<String> uploadFotosParaS3(UUID imovelId, List<MultipartFile> fotos) {
        // Verifica se o imóvel existe antes de fazer upload, para evitar uploads órfãos
        if (!repository.existsById(String.valueOf(imovelId))) {
            throw new RuntimeException("Imóvel não encontrado com o ID: " + imovelId + ". Não foi possível fazer upload das fotos.");
        }

        List<String> uploadedKeys = fotos.stream()
                .map(f -> s3Service.upload(imovelId.toString(), f))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return uploadedKeys;
    }

    @Transactional
    public Imovel atualizarImovelComFotos(UUID imovelId, FotosDTO fotosDTO) {
        Imovel imovel = repository.findById(String.valueOf(imovelId))
                .orElseThrow(() -> new RuntimeException("Imóvel não encontrado com o ID: " + imovelId));

        imovel.setFotos(fotosDTO.fotos());
        imovel.setCapa(fotosDTO.capa());

        return repository.save(imovel);
    }


}


