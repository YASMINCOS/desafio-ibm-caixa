package br.com.patinhaas.backend.api.v2.dto;

import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemaRequestDTO {

    @NotBlank
    private String nome;

    @NotBlank
    private String matricula;

    @NotBlank
    private String unidade;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String problemaDescricao;

    @NotBlank
    private String processo;

    @NotNull
    private CategoriaEnum categoria;

    private BigDecimal impactoFinanceiro;

    @NotBlank
    private String tipoSolucaoEsperada;

    private Integer impactoPessoas;
}
