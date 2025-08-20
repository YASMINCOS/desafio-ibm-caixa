package br.com.patinhaas.backend.domain.service;

import br.com.patinhaas.backend.domain.exception.IdeiaNotFoundException;
import br.com.patinhaas.backend.domain.model.Ideia;
import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import br.com.patinhaas.backend.domain.repository.IdeiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
