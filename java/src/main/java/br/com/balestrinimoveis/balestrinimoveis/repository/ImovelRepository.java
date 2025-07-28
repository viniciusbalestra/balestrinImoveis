package br.com.balestrinimoveis.balestrinimoveis.repository;

import br.com.balestrinimoveis.balestrinimoveis.model.categoria.Categoria;
import br.com.balestrinimoveis.balestrinimoveis.model.imovel.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ImovelRepository extends JpaRepository<Imovel, String> {
    @Query(value = "SELECT i FROM Imovel i WHERE i.categoria = :categoria ORDER BY RAND() LIMIT 4", nativeQuery = false)
    public List<Imovel> findRandom4Imoveis(Categoria categoria);

    public List<Imovel> findByCategoria(Categoria categoria);
}
