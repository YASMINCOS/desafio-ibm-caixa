package br.com.patinhaas.backend.domain.repository;

import br.com.patinhaas.backend.domain.model.Problema;
import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProblemaRepository extends JpaRepository<Problema, String>, JpaSpecificationExecutor<Problema> {

    List<Problema> findByStatus(Status status);

    List<Problema> findByCategoria(CategoriaEnum categoria);

    List<Problema> findByNomeContaining(String nome);

    List<Problema> findByEmail(String email);

    @Query("SELECT p FROM Problema p WHERE p.id = :id")
    Optional<Problema> findProblemaById(@Param("id") String id);

    @Query("SELECT p FROM Problema p WHERE p.status = :status AND p.categoria = :categoria")
    List<Problema> findByStatusAndCategoria(@Param("status") Status status, @Param("categoria") CategoriaEnum categoria);

    @Query("SELECT p FROM Problema p WHERE p.matchingScore IS NOT NULL ORDER BY p.matchingScore DESC")
    List<Problema> findByMatchingScoreNotNullOrderByMatchingScoreDesc();
}
