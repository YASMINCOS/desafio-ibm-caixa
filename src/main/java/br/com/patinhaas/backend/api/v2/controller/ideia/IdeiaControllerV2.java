package br.com.patinhaas.backend.api.v2.controller.ideia;

import br.com.patinhaas.backend.api.v2.converter.IdeiaAssemblerV2;
import br.com.patinhaas.backend.api.v2.dto.IdeiaRequestDTO;
import br.com.patinhaas.backend.api.v2.dto.IdeiaResponseDTO;
import br.com.patinhaas.backend.domain.model.Ideia;
import br.com.patinhaas.backend.domain.model.enums.Status;
import br.com.patinhaas.backend.domain.repository.IdeiaRepository;
import br.com.patinhaas.backend.domain.service.IdeiaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.patinhaas.backend.infra.web.PatinhasMediaType.V2_APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(value = "/ideias", produces = V2_APPLICATION_JSON_VALUE)
public class IdeiaControllerV2 {

    @Autowired
    private IdeiaRepository ideiaRepository;

    @Autowired
    private IdeiaService ideiaService;

    @Autowired
    private IdeiaAssemblerV2 ideiaAssembler;

    @GetMapping
    public List<IdeiaResponseDTO> listar() {
        List<Ideia> ideias = ideiaRepository.findAll();
        return ideiaAssembler.toListDTO(ideias);
    }

    @GetMapping("/{id}")
    public IdeiaResponseDTO buscarPorId(@PathVariable String id) {
        return ideiaAssembler.toDTO(ideiaService.findById(id));
    }

    @GetMapping("/status/{status}")
    public List<IdeiaResponseDTO> buscarPorStatus(@PathVariable String status) {
        Status statusEnum = Status.valueOf(status.toUpperCase());
        List<Ideia> ideias = ideiaService.findByStatus(statusEnum);
        return ideiaAssembler.toListDTO(ideias);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IdeiaResponseDTO criar(@RequestBody @Valid IdeiaRequestDTO dto) {
        Ideia ideia = ideiaAssembler.toDomain(dto);
        return ideiaAssembler.toDTO(ideiaService.save(ideia));
    }

    @PutMapping("/{id}")
    public IdeiaResponseDTO atualizar(@PathVariable String id,
                                      @RequestBody @Valid IdeiaRequestDTO dto) {
        Ideia ideiaSave = ideiaService.findById(id);
        ideiaAssembler.copyToDomain(dto, ideiaSave);
        return ideiaAssembler.toDTO(ideiaService.update(ideiaSave));
    }

    @PutMapping("/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarStatus(@PathVariable String id, @RequestParam String status) {
        Status statusEnum = Status.valueOf(status.toUpperCase());
        ideiaService.updateStatus(id, statusEnum);
    }

    @PutMapping("/{id}/avaliacao-ia")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarAvaliacaoIA(@PathVariable String id, @RequestBody String avaliacao) {
        ideiaService.updateAvaliacaoIA(id, avaliacao);
    }

    @PutMapping("/{id}/avaliacao-humana")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarAvaliacaoHumana(@PathVariable String id, @RequestBody String avaliacao) {
        ideiaService.updateAvaliacaoHumana(id, avaliacao);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable String id) {
        ideiaService.delete(id);
    }
}
