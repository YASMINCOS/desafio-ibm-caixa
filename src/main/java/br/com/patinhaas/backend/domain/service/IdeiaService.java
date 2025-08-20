package br.com.patinhaas.backend.domain.service;

import br.com.patinhaas.backend.domain.exception.IdeiaNotFoundException;
import br.com.patinhaas.backend.domain.model.Ideia;
import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import br.com.patinhaas.backend.domain.repository.IdeiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .filter(ideia -> calculateSimilarity(ideiaBase, ideia) > 0.3) // Threshold de similaridade
                .collect(Collectors.toList());
    }

    public List<Ideia> findSimilarIdeiasFromText(String textoDescricao) {
        List<Ideia> todasIdeias = findAll();

        return todasIdeias.stream()
                .filter(ideia -> calculateSimilarityWithText(textoDescricao, ideia) > 0.3)
                .collect(Collectors.toList());
    }

    private double calculateSimilarity(Ideia ideia1, Ideia ideia2) {
        double score = 0.0;
        int criterios = 0;

        // Comparação por categoria (peso maior)
        if (ideia1.getCategoria() != null && ideia2.getCategoria() != null) {
            if (ideia1.getCategoria().equals(ideia2.getCategoria())) {
                score += 0.3;
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

        // Comparação da metodologia
        if (ideia1.getMetodologiaExecucao() != null && ideia2.getMetodologiaExecucao() != null) {
            double textSimilarity = calculateTextSimilarity(
                    ideia1.getMetodologiaExecucao(),
                    ideia2.getMetodologiaExecucao()
            );
            score += textSimilarity * 0.2;
            criterios++;
        }

        return criterios > 0 ? score / criterios : 0.0;
    }

    private double calculateSimilarityWithText(String texto, Ideia ideia) {
        double score = 0.0;
        int comparacoes = 0;

        if (ideia.getDesafioProblema() != null) {
            score += calculateTextSimilarity(texto, ideia.getDesafioProblema());
            comparacoes++;
        }

        if (ideia.getSolucaoDescricao() != null) {
            score += calculateTextSimilarity(texto, ideia.getSolucaoDescricao());
            comparacoes++;
        }

        if (ideia.getMetodologiaExecucao() != null) {
            score += calculateTextSimilarity(texto, ideia.getMetodologiaExecucao());
            comparacoes++;
        }

        return comparacoes > 0 ? score / comparacoes : 0.0;
    }

    private double calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) return 0.0;

        String[] words1 = text1.toLowerCase().split("\\W+");
        String[] words2 = text2.toLowerCase().split("\\W+");

        Set<String> set1 = new HashSet<>();
        Set<String> set2 = new HashSet<>();

        // Remove palavras muito comuns (stop words básicas)
        Set<String> stopWords = Set.of("a", "o", "e", "de", "da", "do", "em", "um", "uma", "para", "com", "por", "que", "se", "na", "no");

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

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return union.size() > 0 ? (double) intersection.size() / union.size() : 0.0;
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
