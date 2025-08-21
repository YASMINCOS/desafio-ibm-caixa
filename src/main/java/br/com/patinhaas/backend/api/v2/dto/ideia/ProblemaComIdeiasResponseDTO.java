package br.com.patinhaas.backend.api.v2.dto.ideia;


import br.com.patinhaas.backend.api.v2.dto.probelma.ProblemaResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemaComIdeiasResponseDTO {
    private ProblemaResponseDTO problema;
    private List<IdeiaResponseDTO> ideiasRelacionadas;
}
