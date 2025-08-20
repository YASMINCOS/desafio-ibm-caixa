package br.com.patinhaas.backend.domain.service;

import br.com.patinhaas.backend.api.v2.converter.IdeiaAssemblerV2;
import br.com.patinhaas.backend.api.v2.dto.IdeiasSemelhantesResponseDTO;
import br.com.patinhaas.backend.domain.exception.IdeiaNotFoundException;
import br.com.patinhaas.backend.domain.model.Ideia;
import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import br.com.patinhaas.backend.domain.repository.IdeiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class IdeiaService {

    @Autowired
    private IdeiaRepository ideiaRepository;

    public Ideia findById(String id) {
        return ideiaRepository.findById(id)
                .orElseThrow(() -> new IdeiaNotFoundException(id));
    }

    public List<Ideia> findAll() {
        return ideiaRepository.findAll();
    }

    public List<Ideia> findByStatus(Status status) {
        return ideiaRepository.findByStatus(status);
    }

    public List<Ideia> findByStatusAndCategoria(Status status, CategoriaEnum categoria) {
        return ideiaRepository.findByStatusAndCategoria(status, categoria);
    }

    public List<Ideia> findSimilarIdeias(String ideiaId) {
        Ideia ideiaBase = findById(ideiaId);
        List<Ideia> todasIdeias = findAll();

        return todasIdeias.stream()
                .filter(ideia -> !ideia.getId().equals(ideiaId)) // Exclui a própria ideia
                .map(ideia -> new IdeiaComScore(ideia, calculateSimilarity(ideiaBase, ideia)))
                .filter(ideiaScore -> ideiaScore.getScore() > 0.3) // Threshold de similaridade
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore())) // Ordena por score (maior primeiro)
                .map(IdeiaComScore::getIdeia)
                .collect(Collectors.toList());
    }

    public List<Ideia> findSimilarIdeiasFromText(String textoDescricao) {
        if (textoDescricao == null || textoDescricao.trim().isEmpty()) {
            return new ArrayList<>();
        }

        List<Ideia> todasIdeias = findAll();

        return todasIdeias.stream()
                .map(ideia -> new IdeiaComScore(ideia, calculateSimilarityWithText(textoDescricao, ideia)))
                .filter(ideiaScore -> ideiaScore.getScore() > 0.2) // Threshold menor para busca por texto
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .map(IdeiaComScore::getIdeia)
                .collect(Collectors.toList());
    }

    private double calculateSimilarity(Ideia ideia1, Ideia ideia2) {
        double score = 0.0;
        int criterios = 0;

        // Comparação por categoria (peso maior)
        if (ideia1.getCategoria() != null && ideia2.getCategoria() != null) {
            if (ideia1.getCategoria().equals(ideia2.getCategoria())) {
                score += 0.4; // Aumentei o peso da categoria
            }
            criterios++;
        }

        // Comparação textual do desafio/problema
        if (ideia1.getDesafioProblema() != null && ideia2.getDesafioProblema() != null) {
            double textSimilarity = calculateTextSimilarity(
                    ideia1.getDesafioProblema(),
                    ideia2.getDesafioProblema()
            );
            score += textSimilarity * 0.25;
            criterios++;
        }

        // Comparação da solução
        if (ideia1.getSolucaoDescricao() != null && ideia2.getSolucaoDescricao() != null) {
            double textSimilarity = calculateTextSimilarity(
                    ideia1.getSolucaoDescricao(),
                    ideia2.getSolucaoDescricao()
            );
            score += textSimilarity * 0.25;
            criterios++;
        }

        // Comparação do nome do experimento
        if (ideia1.getNomeExperimento() != null && ideia2.getNomeExperimento() != null) {
            double textSimilarity = calculateTextSimilarity(
                    ideia1.getNomeExperimento(),
                    ideia2.getNomeExperimento()
            );
            score += textSimilarity * 0.1;
            criterios++;
        }

        return criterios > 0 ? score : 0.0;
    }

    private double calculateSimilarityWithText(String texto, Ideia ideia) {
        double score = 0.0;
        int comparacoes = 0;

        if (ideia.getDesafioProblema() != null && !ideia.getDesafioProblema().trim().isEmpty()) {
            score += calculateTextSimilarity(texto, ideia.getDesafioProblema()) * 0.4;
            comparacoes++;
        }

        if (ideia.getSolucaoDescricao() != null && !ideia.getSolucaoDescricao().trim().isEmpty()) {
            score += calculateTextSimilarity(texto, ideia.getSolucaoDescricao()) * 0.3;
            comparacoes++;
        }

        if (ideia.getNomeExperimento() != null && !ideia.getNomeExperimento().trim().isEmpty()) {
            score += calculateTextSimilarity(texto, ideia.getNomeExperimento()) * 0.2;
            comparacoes++;
        }

        if (ideia.getMetodologiaExecucao() != null && !ideia.getMetodologiaExecucao().trim().isEmpty()) {
            score += calculateTextSimilarity(texto, ideia.getMetodologiaExecucao()) * 0.1;
            comparacoes++;
        }

        return comparacoes > 0 ? score : 0.0;
    }

    private double calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null || text1.trim().isEmpty() || text2.trim().isEmpty()) {
            return 0.0;
        }

        String[] words1 = text1.toLowerCase()
                .replaceAll("[^a-záàâãéèêíïóôõöúçñ\\s]", "") // Remove pontuação mantendo acentos
                .split("\\s+");
        String[] words2 = text2.toLowerCase()
                .replaceAll("[^a-záàâãéèêíïóôõöúçñ\\s]", "")
                .split("\\s+");

        Set<String> set1 = new HashSet<>();
        Set<String> set2 = new HashSet<>();

        // Stop words em português
        Set<String> stopWords = Set.of(
                "a", "o", "e", "de", "da", "do", "em", "um", "uma", "para", "com", "por",
                "que", "se", "na", "no", "as", "os", "das", "dos", "nas", "nos", "ao",
                "à", "pela", "pelo", "pelas", "pelos", "ser", "ter", "ou", "mais", "como",
                "mas", "não", "sua", "seu", "suas", "seus", "esta", "este", "estas", "estes",
                "essa", "esse", "essas", "esses", "já", "foi", "são", "tem", "têm", "muito",
                "pode", "podem", "sobre", "também", "quando", "onde", "sistema", "através"
        );

        for (String word : words1) {
            if (word.length() > 2 && !stopWords.contains(word)) {
                set1.add(word);
            }
        }

        for (String word : words2) {
            if (word.length() > 2 && !stopWords.contains(word)) {
                set2.add(word);
            }
        }

        if (set1.isEmpty() || set2.isEmpty()) {
            return 0.0;
        }

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return union.size() > 0 ? (double) intersection.size() / union.size() : 0.0;
    }

    // Novos métodos com detalhes para o frontend
    public IdeiasSemelhantesResponseDTO findSimilarIdeiasWithDetails(String ideiaId, IdeiaAssemblerV2 assembler) {
        Ideia ideiaBase = findById(ideiaId);
        List<Ideia> todasIdeias = findAll();

        List<IdeiasSemelhantesResponseDTO.IdeiaComScoreDTO> ideiasSemelhantes = todasIdeias.stream()
                .filter(ideia -> !ideia.getId().equals(ideiaId))
                .map(ideia -> {
                    double score = calculateSimilarity(ideiaBase, ideia);
                    return new IdeiaComScoreDetalhada(ideia, score, getCriteriosMatch(ideiaBase, ideia));
                })
                .filter(ideiaScore -> ideiaScore.getScore() > 0.3)
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .map(ideiaScore -> new IdeiasSemelhantesResponseDTO.IdeiaComScoreDTO(
                        assembler.toDTO(ideiaScore.getIdeia()),
                        ideiaScore.getScore() * 100, // Converte para percentual
                        getNivelSimilaridade(ideiaScore.getScore()),
                        ideiaScore.getCriterios()
                ))
                .collect(Collectors.toList());

        return new IdeiasSemelhantesResponseDTO(
                ideiaBase.getId(),
                ideiaBase.getNomeExperimento(),
                ideiasSemelhantes.size(),
                ideiasSemelhantes
        );
    }

    public IdeiasSemelhantesResponseDTO findSimilarIdeiasFromTextWithDetails(String textoDescricao, IdeiaAssemblerV2 assembler) {
        if (textoDescricao == null || textoDescricao.trim().isEmpty()) {
            return new IdeiasSemelhantesResponseDTO("", "Texto fornecido", 0, new ArrayList<>());
        }

        List<Ideia> todasIdeias = findAll();

        List<IdeiasSemelhantesResponseDTO.IdeiaComScoreDTO> ideiasSemelhantes = todasIdeias.stream()
                .map(ideia -> {
                    double score = calculateSimilarityWithText(textoDescricao, ideia);
                    return new IdeiaComScoreDetalhada(ideia, score, getCriteriosMatchTexto(textoDescricao, ideia));
                })
                .filter(ideiaScore -> ideiaScore.getScore() > 0.2)
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .map(ideiaScore -> new IdeiasSemelhantesResponseDTO.IdeiaComScoreDTO(
                        assembler.toDTO(ideiaScore.getIdeia()),
                        ideiaScore.getScore() * 100,
                        getNivelSimilaridade(ideiaScore.getScore()),
                        ideiaScore.getCriterios()
                ))
                .collect(Collectors.toList());

        return new IdeiasSemelhantesResponseDTO(
                "",
                "Busca por texto: " + (textoDescricao.length() > 50 ? textoDescricao.substring(0, 50) + "..." : textoDescricao),
                ideiasSemelhantes.size(),
                ideiasSemelhantes
        );
    }

    private String getNivelSimilaridade(double score) {
        if (score >= 0.7) return "Alta";
        if (score >= 0.4) return "Média";
        return "Baixa";
    }

    private List<String> getCriteriosMatch(Ideia ideia1, Ideia ideia2) {
        List<String> criterios = new ArrayList<>();

        if (ideia1.getCategoria() != null && ideia2.getCategoria() != null &&
                ideia1.getCategoria().equals(ideia2.getCategoria())) {
            criterios.add("Mesma categoria: " + ideia1.getCategoria());
        }

        if (ideia1.getDesafioProblema() != null && ideia2.getDesafioProblema() != null) {
            double similarity = calculateTextSimilarity(ideia1.getDesafioProblema(), ideia2.getDesafioProblema());
            if (similarity > 0.3) {
                criterios.add("Problemas similares (" + Math.round(similarity * 100) + "% match)");
            }
        }

        if (ideia1.getSolucaoDescricao() != null && ideia2.getSolucaoDescricao() != null) {
            double similarity = calculateTextSimilarity(ideia1.getSolucaoDescricao(), ideia2.getSolucaoDescricao());
            if (similarity > 0.3) {
                criterios.add("Soluções similares (" + Math.round(similarity * 100) + "% match)");
            }
        }

        return criterios;
    }

    public List<Ideia> findByNomeExperimento(String nomeExperimento) {
        if (nomeExperimento == null || nomeExperimento.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return ideiaRepository.findByNomeExperimentoContainingIgnoreCase(nomeExperimento.trim());
    }

    /**
     * Busca ideias por nome do experimento com status específico
     * @param nomeExperimento parte do nome do experimento
     * @param status status da ideia
     * @return lista de ideias filtradas
     */
    public List<Ideia> findByNomeExperimentoAndStatus(String nomeExperimento, Status status) {
        if (nomeExperimento == null || nomeExperimento.trim().isEmpty()) {
            return findByStatus(status);
        }
        return ideiaRepository.findByNomeExperimentoLikeAndStatus(nomeExperimento.trim(), status);
    }

    public List<Ideia> findIdeiasComFiltros(String nomeExperimento, Status status, CategoriaEnum categoria) {
        // Se não há filtros, retorna todas
        if ((nomeExperimento == null || nomeExperimento.trim().isEmpty()) &&
                status == null && categoria == null) {
            return findAll();
        }

        // Implementação usando Specifications ou Query customizada
        List<Ideia> resultado = findAll();

        // Filtro por nome
        if (nomeExperimento != null && !nomeExperimento.trim().isEmpty()) {
            String nomeLower = nomeExperimento.toLowerCase().trim();
            resultado = resultado.stream()
                    .filter(ideia -> ideia.getNomeExperimento() != null &&
                            ideia.getNomeExperimento().toLowerCase().contains(nomeLower))
                    .collect(Collectors.toList());
        }

        // Filtro por status
        if (status != null) {
            resultado = resultado.stream()
                    .filter(ideia -> ideia.getStatus() == status)
                    .collect(Collectors.toList());
        }

        // Filtro por categoria
        if (categoria != null) {
            resultado = resultado.stream()
                    .filter(ideia -> ideia.getCategoria() == categoria)
                    .collect(Collectors.toList());
        }

        return resultado;
    }

    private List<String> getCriteriosMatchTexto(String texto, Ideia ideia) {
        List<String> criterios = new ArrayList<>();

        if (ideia.getDesafioProblema() != null) {
            double similarity = calculateTextSimilarity(texto, ideia.getDesafioProblema());
            if (similarity > 0.2) {
                criterios.add("Match com problema (" + Math.round(similarity * 100) + "%)");
            }
        }

        if (ideia.getSolucaoDescricao() != null) {
            double similarity = calculateTextSimilarity(texto, ideia.getSolucaoDescricao());
            if (similarity > 0.2) {
                criterios.add("Match com solução (" + Math.round(similarity * 100) + "%)");
            }
        }

        if (ideia.getNomeExperimento() != null) {
            double similarity = calculateTextSimilarity(texto, ideia.getNomeExperimento());
            if (similarity > 0.2) {
                criterios.add("Match com nome (" + Math.round(similarity * 100) + "%)");
            }
        }

        return criterios;
    }

    // Classes auxiliares
    private static class IdeiaComScore {
        private final Ideia ideia;
        private final double score;

        public IdeiaComScore(Ideia ideia, double score) {
            this.ideia = ideia;
            this.score = score;
        }

        public Ideia getIdeia() {
            return ideia;
        }

        public double getScore() {
            return score;
        }
    }

    private static class IdeiaComScoreDetalhada extends IdeiaComScore {
        private final List<String> criterios;

        public IdeiaComScoreDetalhada(Ideia ideia, double score, List<String> criterios) {
            super(ideia, score);
            this.criterios = criterios;
        }

        public List<String> getCriterios() {
            return criterios;
        }
    }

    @Transactional
    public Ideia save(Ideia ideia) {
        return ideiaRepository.save(ideia);
    }

    @Transactional
    public Ideia update(Ideia ideia) {
        return ideiaRepository.save(ideia);
    }

    @Transactional
    public void updateStatus(String id, Status status) {
        Ideia ideia = findById(id);
        ideia.setStatus(status);
        ideiaRepository.save(ideia);
    }

    @Transactional
    public void delete(String id) {
        Ideia ideia = findById(id);
        ideiaRepository.delete(ideia);
    }

    @Transactional
    public void updateAvaliacaoIA(String id, String avaliacao) {
        Ideia ideia = findById(id);
        ideia.setAvaliacaoIA(avaliacao);
        ideiaRepository.save(ideia);
    }

    @Transactional
    public void updateAvaliacaoHumana(String id, String avaliacao) {
        Ideia ideia = findById(id);
        ideia.setAvaliacaoHumana(avaliacao);
        ideiaRepository.save(ideia);
    }
}
