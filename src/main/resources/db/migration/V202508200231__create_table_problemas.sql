CREATE TABLE problemas
(
    id                    VARCHAR(36) PRIMARY KEY,
    nome                  VARCHAR(255) NOT NULL,
    matricula             VARCHAR(255) NOT NULL,
    unidade               VARCHAR(255) NOT NULL,
    email                 VARCHAR(255) NOT NULL,
    problema_descricao    TEXT         NOT NULL,
    processo              TEXT         NOT NULL,
    categoria             VARCHAR(50)  NOT NULL,
    impacto_financeiro    DECIMAL(10, 2),
    tipo_solucao_esperada TEXT         NOT NULL,
    status                VARCHAR(50)  NOT NULL DEFAULT 'ABERTO',
    matching_score        DOUBLE,
    data_criacao          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    impacto_pessoas       INTEGER,

    CONSTRAINT ck_problema_categoria CHECK (categoria IN
                                            ('OPERACIONAL', 'TECNOLOGICA', 'ATENDIMENTO', 'COMPLIANCE', 'GESTAO',
                                             'SUSTENTABILIDADE', 'ECOSSISTEMA')),
    CONSTRAINT ck_problema_status CHECK (status IN ('ABERTO', 'EM_ANALISE', 'VALIDADO', 'REJEITADO', 'IMPLEMENTADO'))
);

-- Índices para tabela problemas
CREATE INDEX idx_problemas_status ON problemas (status);
CREATE INDEX idx_problemas_categoria ON problemas (categoria);
CREATE INDEX idx_problemas_email ON problemas (email);
CREATE INDEX idx_problemas_nome ON problemas (nome);
CREATE INDEX idx_problemas_matching_score ON problemas (matching_score);
CREATE INDEX idx_problemas_data_criacao ON problemas (data_criacao);
CREATE INDEX idx_problemas_status_categoria ON problemas (status, categoria);
