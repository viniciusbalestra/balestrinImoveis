package br.com.balestrinimoveis.balestrinimoveis.service.impl;

import br.com.balestrinimoveis.balestrinimoveis.service.S3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;
    private final String bucket;

    public S3ServiceImpl(S3Client s3Client, @Value("${aws.s3.bucket-name}") String bucket) {
        this.s3Client = s3Client;
        this.bucket = bucket;
    }

    @Override
    public Optional<String> upload(String prefixo, MultipartFile arquivo) {
        if (arquivo.isEmpty()) {
            System.err.println("Arquivo vazio recebido para upload.");
            return Optional.empty();
        }

        String nomeOriginal = arquivo.getOriginalFilename();
        String extensao = "";
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        }
        // A chave S3 será "ID_DO_IMOVEL/UUID_UNICO.extensao"
        String key = prefixo + "/" + UUID.randomUUID().toString() + extensao;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(arquivo.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(arquivo.getBytes()));
            System.out.println("Upload para S3 concluído: " + key);
            return Optional.of(key);

        } catch (IOException e) {
            System.err.println("Erro de IO ao fazer upload para S3 (ler bytes do arquivo): " + e.getMessage());

            return Optional.empty();

        } catch (Exception e) {
            System.err.println("Erro inesperado ao fazer upload para S3 para chave " + key + ": " + e.getMessage());

            return Optional.empty();
        }
    }
}