package br.com.patinhaas.backend.api.v2.converter;

import br.com.patinhaas.backend.api.v2.dto.ProblemaRequestDTO;
import br.com.patinhaas.backend.api.v2.dto.ProblemaResponseDTO;
import br.com.patinhaas.backend.domain.model.Problema;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProblemaAssemblerV2 {

    public ProblemaResponseDTO toDTO(Problema problema) {
        if (problema == null) {
            return null;
        }

        ProblemaResponseDTO dto = new ProblemaResponseDTO();
        dto.setId(problema.getId());
        dto.setNome(problema.getNome());
        dto.setMatricula(problema.getMatricula());
        dto.setUnidade(problema.getUnidade());
        dto.setEmail(problema.getEmail());
        dto.setProblemaDescricao(problema.getProblemaDescricao());
        dto.setProcesso(problema.getProcesso());
        dto.setCategoria(problema.getCategoria());
        dto.setImpactoFinanceiro(problema.getImpactoFinanceiro());
        dto.setTipoSolucaoEsperada(problema.getTipoSolucaoEsperada());
        dto.setStatus(problema.getStatus());
        dto.setMatchingScore(problema.getMatchingScore());
        dto.setDataCriacao(problema.getDataCriacao());
        dto.setImpactoPessoas(problema.getImpactoPessoas());

        return dto;
    }

    public Problema toDomain(ProblemaRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Problema problema = new Problema();
        problema.setNome(dto.getNome());
        problema.setMatricula(dto.getMatricula());
        problema.setUnidade(dto.getUnidade());
        problema.setEmail(dto.getEmail());
        problema.setProblemaDescricao(dto.getProblemaDescricao());
        problema.setProcesso(dto.getProcesso());
        problema.setCategoria(dto.getCategoria());
        problema.setImpactoFinanceiro(dto.getImpactoFinanceiro());
        problema.setTipoSolucaoEsperada(dto.getTipoSolucaoEsperada());
        problema.setImpactoPessoas(dto.getImpactoPessoas());

        return problema;
    }

    public void copyToDomain(ProblemaRequestDTO dto, Problema problema) {
        if (dto == null || problema == null) {
            return;
        }

        problema.setNome(dto.getNome());
        problema.setMatricula(dto.getMatricula());
        problema.setUnidade(dto.getUnidade());
        problema.setEmail(dto.getEmail());
        problema.setProblemaDescricao(dto.getProblemaDescricao());
        problema.setProcesso(dto.getProcesso());
        problema.setCategoria(dto.getCategoria());
        problema.setImpactoFinanceiro(dto.getImpactoFinanceiro());
        problema.setTipoSolucaoEsperada(dto.getTipoSolucaoEsperada());
        problema.setImpactoPessoas(dto.getImpactoPessoas());
    }

    public List<ProblemaResponseDTO> toListDTO(List<Problema> problemas) {
        return problemas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
