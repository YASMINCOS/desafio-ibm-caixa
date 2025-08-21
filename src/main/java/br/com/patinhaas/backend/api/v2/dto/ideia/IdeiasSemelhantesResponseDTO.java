package br.com.patinhaas.backend.api.v2.dto.ideia;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdeiasSemelhantesResponseDTO {

    private String ideiaBaseId;
    private String ideiaBaseNome;
    private int totalEncontradas;
    private List<IdeiaComScoreDTO> ideiasSemelhantes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IdeiaComScoreDTO {
        private IdeiaResponseDTO ideia;
        private double scorePercentual; // Score convertido para percentual (0-100)
        private String nivelSimilaridade; // "Alta", "Média", "Baixa"
        private List<String> criteriosMatch; // Lista dos critérios que fizeram match
    }
}
