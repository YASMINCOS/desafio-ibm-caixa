package br.com.patinhaas.backend.domain.service;

import br.com.patinhaas.backend.domain.exception.ProblemaNotFoundException;
import br.com.patinhaas.backend.domain.model.Problema;
import br.com.patinhaas.backend.domain.model.enums.Status;
import br.com.patinhaas.backend.domain.repository.ProblemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProblemaService {

    @Autowired
    private ProblemaRepository problemaRepository;

    public Problema findById(String id) {
        return problemaRepository.findById(id)
                .orElseThrow(() -> new ProblemaNotFoundException(id));
    }

    public List<Problema> findAll() {
        return problemaRepository.findAll();
    }

    public List<Problema> findByStatus(Status status) {
        return problemaRepository.findByStatus(status);
    }

    public List<Problema> findByEmail(String email) {
        return problemaRepository.findByEmail(email);
    }

    @Transactional
    public Problema save(Problema problema) {
        Problema saved = problemaRepository.save(problema);
        // Adicione um log aqui para debug
        System.out.println("Problema salvo com ID: " + saved.getId());
        return saved;
    }
    @Transactional
    public Problema update(Problema problema) {
        return problemaRepository.save(problema);
    }

    @Transactional
    public void updateStatus(String id, Status status) {
        Problema problema = findById(id);
        problema.setStatus(status);
        problemaRepository.save(problema);
    }

    @Transactional
    public void delete(String id) {
        Problema problema = findById(id);
        problemaRepository.delete(problema);
    }

    @Transactional
    public void updateMatchingScore(String id, Double score) {
        Problema problema = findById(id);
        problema.setMatchingScore(score);
        problemaRepository.save(problema);
    }

    public List<Problema> findByMatchingScoreOrderedDesc() {
        return problemaRepository.findByMatchingScoreNotNullOrderByMatchingScoreDesc();
    }
}
