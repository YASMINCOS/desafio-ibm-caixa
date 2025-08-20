package br.com.patinhaas.backend.domain.exception;

import jakarta.persistence.EntityNotFoundException;

public class IdeiaNotFoundException extends EntityNotFoundException {
    public IdeiaNotFoundException(String message) {
        super(String.format("Não existe uma Ideia com o código %s", message));
    }
}
