package br.com.patinhaas.backend.api.v2.controller.problema;

import br.com.patinhaas.backend.api.v2.converter.ProblemaAssemblerV2;
import br.com.patinhaas.backend.api.v2.dto.ProblemaRequestDTO;
import br.com.patinhaas.backend.api.v2.dto.ProblemaResponseDTO;
import br.com.patinhaas.backend.domain.model.Problema;
import br.com.patinhaas.backend.domain.model.enums.Status;
import br.com.patinhaas.backend.domain.repository.ProblemaRepository;
import br.com.patinhaas.backend.domain.service.ProblemaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.patinhaas.backend.infra.web.PatinhasMediaType.V2_APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(value = "/problemas", produces = V2_APPLICATION_JSON_VALUE)
public class ProblemaControllerV2 {

    @Autowired
    private ProblemaRepository problemaRepository;

    @Autowired
    private ProblemaService problemaService;

    @Autowired
    private ProblemaAssemblerV2 problemaAssembler;

    @GetMapping
    public List<ProblemaResponseDTO> listar() {
        List<Problema> problemas = problemaRepository.findAll();
        return problemaAssembler.toListDTO(problemas);
    }

    @GetMapping("/{id}")
    public ProblemaResponseDTO buscarPorId(@PathVariable String id) {
        return problemaAssembler.toDTO(problemaService.findById(id));
    }

    @GetMapping("/status/{status}")
    public List<ProblemaResponseDTO> buscarPorStatus(@PathVariable String status) {
        Status statusEnum = Status.valueOf(status.toUpperCase());
        List<Problema> problemas = problemaService.findByStatus(statusEnum);
        return problemaAssembler.toListDTO(problemas);
    }

    @GetMapping("/email/{email}")
    public List<ProblemaResponseDTO> buscarPorEmail(@PathVariable String email) {
        List<Problema> problemas = problemaService.findByEmail(email);
        return problemaAssembler.toListDTO(problemas);
    }

    @GetMapping("/matching-score")
    public List<ProblemaResponseDTO> buscarPorMatchingScore() {
        List<Problema> problemas = problemaService.findByMatchingScoreOrderedDesc();
        return problemaAssembler.toListDTO(problemas);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProblemaResponseDTO criar(@RequestBody @Valid ProblemaRequestDTO dto) {
        Problema problema = problemaAssembler.toDomain(dto);
        return problemaAssembler.toDTO(problemaService.save(problema));
    }

    @PutMapping("/{id}")
    public ProblemaResponseDTO atualizar(@PathVariable String id,
                                         @RequestBody @Valid ProblemaRequestDTO dto) {
        Problema problemaSave = problemaService.findById(id);
        problemaAssembler.copyToDomain(dto, problemaSave);
        return problemaAssembler.toDTO(problemaService.update(problemaSave));
    }

    @PutMapping("/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarStatus(@PathVariable String id, @RequestParam String status) {
        Status statusEnum = Status.valueOf(status.toUpperCase());
        problemaService.updateStatus(id, statusEnum);
    }

    @PutMapping("/{id}/matching-score")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarMatchingScore(@PathVariable String id, @RequestParam Double score) {
        problemaService.updateMatchingScore(id, score);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable String id) {
        problemaService.delete(id);
    }
}
