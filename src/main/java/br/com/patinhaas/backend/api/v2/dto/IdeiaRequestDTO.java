package br.com.patinhaas.backend.api.v2.dto;


import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeiaRequestDTO {

    @NotBlank
    private String nomeProponente;

    @NotBlank
    private String matriculaProponente;

    @NotBlank
    private String unidadeProponente;

    @NotBlank
    private String nomeExperimento;

    @NotBlank
    private String equipeEnvolvida;

    @NotBlank
    private String desafioProblema;

    @NotBlank
    private String solucaoDescricao;

    @NotBlank
    private String metodologiaExecucao;

    @NotBlank
    private String hipotesePrincipal;

    @NotBlank
    private String horizonteInovacao;

    @NotBlank
    private String baselineAtual;

    @NotBlank
    private String resultadosEsperados;

    @NotBlank
    private String kpisSmart;

    @NotNull
    private CategoriaEnum categoria;

    private String avaliacaoIA;

    private String avaliacaoHumana;
}



