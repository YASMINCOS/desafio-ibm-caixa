package br.com.patinhaas.backend.domain.exception;

import jakarta.persistence.EntityNotFoundException;

public class ProblemaNotFoundException extends EntityNotFoundException {
    public ProblemaNotFoundException(String message) {
        super(String.format("Não existe um Problema com o código %s", message));
    }
}
