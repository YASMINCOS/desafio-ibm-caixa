package br.com.patinhaas.backend.api.v2.dto.ideia;


import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeiaRequestDTO {

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

    private String avaliacaoIA;

    private String avaliacaoHumana;
}



