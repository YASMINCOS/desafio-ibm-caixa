package br.com.patinhaas.backend.api.v2.controller.ideia;

import br.com.patinhaas.backend.api.v2.converter.IdeiaAssemblerV2;
import br.com.patinhaas.backend.api.v2.dto.IdeiaRequestDTO;
import br.com.patinhaas.backend.api.v2.dto.IdeiaResponseDTO;
import br.com.patinhaas.backend.domain.model.Ideia;
import br.com.patinhaas.backend.domain.model.enums.Status;
import br.com.patinhaas.backend.domain.repository.IdeiaRepository;
import br.com.patinhaas.backend.domain.service.IdeiaService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static br.com.patinhaas.backend.infra.web.PatinhasMediaType.V2_APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(value = "/ideias", produces = V2_APPLICATION_JSON_VALUE)
public class IdeiaControllerV2 {

    private static final Logger logger = LoggerFactory.getLogger(IdeiaControllerV2.class);

    @Autowired
    private IdeiaRepository ideiaRepository;

    @Autowired
    private IdeiaService ideiaService;

    @Autowired
    private IdeiaAssemblerV2 ideiaAssembler;

    // Endpoint de health check
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        try {
            long count = ideiaRepository.count();
            String message = String.format("✅ Conexão OK. Total de registros: %d", count);
            logger.info("Health check realizado com sucesso: {}", message);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            String errorMessage = "❌ Erro na conexão com banco: " + e.getMessage();
            logger.error("Erro no health check", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @GetMapping
    public List<IdeiaResponseDTO> listar() {
        logger.info("📋 Listando todas as ideias");
        try {
            List<Ideia> ideias = ideiaRepository.findAll();
            logger.info("✅ Encontradas {} ideias", ideias.size());
            return ideiaAssembler.toListDTO(ideias);
        } catch (Exception e) {
            logger.error("❌ Erro ao listar ideias", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public IdeiaResponseDTO buscarPorId(@PathVariable String id) {
        logger.info("🔍 Buscando ideia por ID: {}", id);
        try {
            Ideia ideia = ideiaService.findById(id);
            logger.info("✅ Ideia encontrada: {}", ideia.getNomeExperimento());
            return ideiaAssembler.toDTO(ideia);
        } catch (Exception e) {
            logger.error("❌ Erro ao buscar ideia por ID: {}", id, e);
            throw e;
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IdeiaResponseDTO criar(@RequestBody IdeiaRequestDTO dto) {
        logger.info("🆕 Iniciando criação de nova ideia");
        logger.info("📥 Dados recebidos - Nome: {}, Experimento: {}",
                dto.getNomeProponente(), dto.getNomeExperimento());

        try {
            // Validação básica
            if (dto.getNomeExperimento() == null || dto.getNomeExperimento().trim().isEmpty()) {
                throw new IllegalArgumentException("Nome do experimento é obrigatório");
            }

            logger.info("🔄 Convertendo DTO para entidade");
            Ideia ideia = ideiaAssembler.toDomain(dto);

            logger.info("💾 Salvando ideia no banco de dados");
            Ideia savedIdeia = ideiaService.save(ideia);

            logger.info("✅ Ideia salva com sucesso - ID: {}", savedIdeia.getId());

            IdeiaResponseDTO response = ideiaAssembler.toDTO(savedIdeia);
            logger.info("📤 Retornando resposta");

            return response;

        } catch (Exception e) {
            logger.error("❌ ERRO ao criar ideia: {}", e.getMessage(), e);
            logger.error("📋 Dados do DTO que causaram erro: {}", dto);
            throw new RuntimeException("Erro interno ao criar ideia: " + e.getMessage(), e);
        }
    }

    @PutMapping("/{id}")
    public IdeiaResponseDTO atualizar(@PathVariable String id,
                                      @RequestBody IdeiaRequestDTO dto) {
        logger.info("🔄 Atualizando ideia ID: {}", id);
        try {
            Ideia ideiaSave = ideiaService.findById(id);
            logger.info("✅ Ideia encontrada para atualização: {}", ideiaSave.getNomeExperimento());

            ideiaAssembler.copyToDomain(dto, ideiaSave);
            Ideia updated = ideiaService.update(ideiaSave);

            logger.info("✅ Ideia atualizada com sucesso");
            return ideiaAssembler.toDTO(updated);
        } catch (Exception e) {
            logger.error("❌ Erro ao atualizar ideia ID: {}", id, e);
            throw e;
        }
    }



    // Resto dos métodos mantidos iguais...
    @GetMapping("/status/{status}")
    public List<IdeiaResponseDTO> buscarPorStatus(@PathVariable String status) {
        Status statusEnum = Status.valueOf(status.toUpperCase());
        List<Ideia> ideias = ideiaService.findByStatus(statusEnum);
        return ideiaAssembler.toListDTO(ideias);
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
