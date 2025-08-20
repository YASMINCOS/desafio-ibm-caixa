package br.com.patinhaas.backend.api.v2.converter;

import br.com.patinhaas.backend.api.v2.dto.IdeiaRequestDTO;
import br.com.patinhaas.backend.api.v2.dto.IdeiaResponseDTO;
import br.com.patinhaas.backend.domain.model.Ideia;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class IdeiaAssemblerV2 {

    public IdeiaResponseDTO toDTO(Ideia ideia) {
        if (ideia == null) {
            return null;
        }

        IdeiaResponseDTO dto = new IdeiaResponseDTO();
        dto.setId(ideia.getId());
        dto.setNomeProponente(ideia.getNomeProponente());
        dto.setMatriculaProponente(ideia.getMatriculaProponente());
        dto.setUnidadeProponente(ideia.getUnidadeProponente());
        dto.setNomeExperimento(ideia.getNomeExperimento());
        dto.setEquipeEnvolvida(ideia.getEquipeEnvolvida());
        dto.setDesafioProblema(ideia.getDesafioProblema());
        dto.setSolucaoDescricao(ideia.getSolucaoDescricao());
        dto.setMetodologiaExecucao(ideia.getMetodologiaExecucao());
        dto.setHipotesePrincipal(ideia.getHipotesePrincipal());
        dto.setHorizonteInovacao(ideia.getHorizonteInovacao());
        dto.setBaselineAtual(ideia.getBaselineAtual());
        dto.setResultadosEsperados(ideia.getResultadosEsperados());
        dto.setKpisSmart(ideia.getKpisSmart());
        dto.setCategoria(ideia.getCategoria());
        dto.setStatus(ideia.getStatus());
        dto.setAvaliacaoIA(ideia.getAvaliacaoIA());
        dto.setAvaliacaoHumana(ideia.getAvaliacaoHumana());
        dto.setDataCriacao(ideia.getDataCriacao());

        return dto;
    }

    public Ideia toDomain(IdeiaRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Ideia ideia = new Ideia();
        ideia.setNomeProponente(dto.getNomeProponente());
        ideia.setMatriculaProponente(dto.getMatriculaProponente());
        ideia.setUnidadeProponente(dto.getUnidadeProponente());
        ideia.setNomeExperimento(dto.getNomeExperimento());
        ideia.setEquipeEnvolvida(dto.getEquipeEnvolvida());
        ideia.setDesafioProblema(dto.getDesafioProblema());
        ideia.setSolucaoDescricao(dto.getSolucaoDescricao());
        ideia.setMetodologiaExecucao(dto.getMetodologiaExecucao());
        ideia.setHipotesePrincipal(dto.getHipotesePrincipal());
        ideia.setHorizonteInovacao(dto.getHorizonteInovacao());
        ideia.setBaselineAtual(dto.getBaselineAtual());
        ideia.setResultadosEsperados(dto.getResultadosEsperados());
        ideia.setKpisSmart(dto.getKpisSmart());
        ideia.setCategoria(dto.getCategoria());
        ideia.setAvaliacaoIA(dto.getAvaliacaoIA());
        ideia.setAvaliacaoHumana(dto.getAvaliacaoHumana());

        return ideia;
    }

    public void copyToDomain(IdeiaRequestDTO dto, Ideia ideia) {
        if (dto == null || ideia == null) {
            return;
        }

        ideia.setNomeProponente(dto.getNomeProponente());
        ideia.setMatriculaProponente(dto.getMatriculaProponente());
        ideia.setUnidadeProponente(dto.getUnidadeProponente());
        ideia.setNomeExperimento(dto.getNomeExperimento());
        ideia.setEquipeEnvolvida(dto.getEquipeEnvolvida());
        ideia.setDesafioProblema(dto.getDesafioProblema());
        ideia.setSolucaoDescricao(dto.getSolucaoDescricao());
        ideia.setMetodologiaExecucao(dto.getMetodologiaExecucao());
        ideia.setHipotesePrincipal(dto.getHipotesePrincipal());
        ideia.setHorizonteInovacao(dto.getHorizonteInovacao());
        ideia.setBaselineAtual(dto.getBaselineAtual());
        ideia.setResultadosEsperados(dto.getResultadosEsperados());
        ideia.setKpisSmart(dto.getKpisSmart());
        ideia.setCategoria(dto.getCategoria());
        ideia.setAvaliacaoIA(dto.getAvaliacaoIA());
        ideia.setAvaliacaoHumana(dto.getAvaliacaoHumana());
    }

    public List<IdeiaResponseDTO> toListDTO(List<Ideia> ideias) {
        return ideias.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
