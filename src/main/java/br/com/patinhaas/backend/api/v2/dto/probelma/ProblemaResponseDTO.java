package br.com.patinhaas.backend.api.v2.dto.probelma;

import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemaResponseDTO {

    private String id;
    private String nome;
    private String matricula;
    private String unidade;
    private String email;
    private String problemaDescricao;
    private String processo;
    private CategoriaEnum categoria;
    private BigDecimal impactoFinanceiro;
    private String tipoSolucaoEsperada;
    private Status status;
    private Double matchingScore;
    private OffsetDateTime dataCriacao;
    private Integer impactoPessoas;
}
