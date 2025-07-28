package br.com.balestrinimoveis.balestrinimoveis.controller;

import br.com.balestrinimoveis.balestrinimoveis.model.FotosDTO;
import br.com.balestrinimoveis.balestrinimoveis.model.categoria.Categoria;
import br.com.balestrinimoveis.balestrinimoveis.model.imovel.Imovel;
import br.com.balestrinimoveis.balestrinimoveis.model.imovel.ImovelDTO;
import br.com.balestrinimoveis.balestrinimoveis.service.ImovelService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ImovelController {

    @Autowired
    ImovelService imovelService;

    @GetMapping("/home")
    public ResponseEntity<Page<ImovelDTO>> listarImoveisHome(@PageableDefault(size = 8, sort = {"titulo"}) Pageable paginacao) {

        return imovelService.listarImoveisPorCategoria(paginacao);
    }

    @GetMapping("/investimentos")
    public ResponseEntity<Page<ImovelDTO>> listarImoveisInvestimento(@PageableDefault(size = 20, sort = {"titulo"}) Pageable paginacao) {

        return imovelService.listarTodosImoveis(paginacao);
    }

    @GetMapping("/investimentos/{categoria}")
    public ResponseEntity<Page<ImovelDTO>> listar1Categoria(@PathVariable Categoria categoria, @PageableDefault(size = 20, sort = {"titulo"}) Pageable paginacao) {

        return imovelService.listar1Categoria(categoria, paginacao);
    }

    @PostMapping("/cadastro")
    @Transactional
    public ResponseEntity cadastrar(@RequestBody String dados, UriComponentsBuilder uriBuilder) throws JsonProcessingException {

        return imovelService.cadastrar(dados, uriBuilder);
    }

    @PostMapping("/fotos/upload/{imovelId}")
    public ResponseEntity<List<String>> uploadFotos(@PathVariable UUID imovelId,
                                                    @RequestParam("fotos") List<MultipartFile> arquivos) {

        if (arquivos == null || arquivos.isEmpty()) {
            return ResponseEntity.badRequest().body(List.of("Nenhum arquivo de foto fornecido."));
        }

        List<String> uploadedKeys = imovelService.uploadFotosParaS3(imovelId, arquivos);
        return ResponseEntity.ok(uploadedKeys);
    }

    @PatchMapping("/imoveis/{imovelId}/fotos")
    public ResponseEntity<Imovel> atualizarImovelComFotos(@PathVariable UUID imovelId,
                                                          @RequestBody FotosDTO fotosDTO) {

        Imovel imovelAtualizado = imovelService.atualizarImovelComFotos(imovelId, fotosDTO);
        return ResponseEntity.ok(imovelAtualizado);
    }
}

