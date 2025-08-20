package br.com.patinhaas.backend.api.v2.dto;

import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeiaResponseDTO {

    private String id;
    private String nomeProponente;
    private String matriculaProponente;
    private String unidadeProponente;
    private String nomeExperimento;
    private String equipeEnvolvida;
    private String desafioProblema;
    private String solucaoDescricao;
    private String metodologiaExecucao;
    private String hipotesePrincipal;
    private String horizonteInovacao;
    private String baselineAtual;
    private String resultadosEsperados;
    private String kpisSmart;
    private CategoriaEnum categoria;
    private Status status;
    private String avaliacaoIA;
    private String avaliacaoHumana;
    private OffsetDateTime dataCriacao;
}
