package br.com.patinhaas.backend.domain.repository;

import br.com.patinhaas.backend.domain.model.Ideia;
import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface IdeiaRepository extends JpaRepository<Ideia, String>, JpaSpecificationExecutor<Ideia> {

    Optional<Ideia> findByNomeExperimento(String nomeExperimento);

    List<Ideia> findByStatus(Status status);

    List<Ideia> findByCategoria(CategoriaEnum categoria);

    List<Ideia> findByNomeProponenteContaining(String nomeProponente);

    @Query("SELECT i FROM Ideia i WHERE i.id = :id")
    Optional<Ideia> findIdeiaById(@Param("id") String id);

    @Query("SELECT i FROM Ideia i WHERE i.status = :status AND i.categoria = :categoria")
    List<Ideia> findByStatusAndCategoria(@Param("status") Status status, @Param("categoria") CategoriaEnum categoria);
}
