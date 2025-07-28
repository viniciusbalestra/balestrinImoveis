package br.com.balestrinimoveis.balestrinimoveis.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

public interface S3Service {
    // Retorna a chave S3 (path completo do objeto no bucket)
    Optional<String> upload(String prefixo, MultipartFile arquivo);
}