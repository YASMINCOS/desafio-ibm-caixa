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
    status                VARCHAR(50)  NOT NULL    DEFAULT 'ABERTO',
    matching_score        DOUBLE PRECISION,
    data_criacao          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    impacto_pessoas       INTEGER,

    CONSTRAINT ck_problema_categoria CHECK (categoria IN
                                            ('OPERACIONAL', 'TECNOLOGICA', 'ATENDIMENTO', 'COMPLIANCE', 'GESTAO',
                                             'SUSTENTABILIDADE', 'ECOSSISTEMA')),
    CONSTRAINT ck_problema_status CHECK (status IN ('ABERTO', 'EM_ANALISE', 'VALIDADO', 'REJEITADO', 'IMPLEMENTADO'))
);

CREATE INDEX idx_ideias_status ON ideias (status);
CREATE INDEX idx_ideias_categoria ON ideias (categoria);
CREATE INDEX idx_ideias_nome_proponente ON ideias (nome_proponente);
CREATE INDEX idx_ideias_data_criacao ON ideias (data_criacao);
CREATE INDEX idx_ideias_status_categoria ON ideias (status, categoria);

-- Índices para tabela problemas
CREATE INDEX idx_problemas_status ON problemas (status);
CREATE INDEX idx_problemas_categoria ON problemas (categoria);
CREATE INDEX idx_problemas_email ON problemas (email);
CREATE INDEX idx_problemas_nome ON problemas (nome);
CREATE INDEX idx_problemas_matching_score ON problemas (matching_score);
CREATE INDEX idx_problemas_data_criacao ON problemas (data_criacao);
CREATE INDEX idx_problemas_status_categoria ON problemas (status, categoria);

-- Comentários nas tabelas para documentação
COMMENT
ON TABLE ideias IS 'Tabela que armazena as ideias submetidas pelos colaboradores';
COMMENT
ON TABLE problemas IS 'Tabela que armazena os problemas identificados pelos colaboradores';

COMMENT
ON COLUMN ideias.horizonte_inovacao IS 'Horizonte de inovação: H1 (curto prazo), H2 (médio prazo), H3 (longo prazo)';
COMMENT
ON COLUMN ideias.matching_score IS 'Score de compatibilidade entre ideia e problema (0-100)';
COMMENT
ON COLUMN problemas.matching_score IS 'Score de compatibilidade com ideias relacionadas (0-100)';
COMMENT
ON COLUMN problemas.impacto_financeiro IS 'Impacto financeiro estimado do problema em reais';
COMMENT
ON COLUMN problemas.impacto_pessoas IS 'Número de pessoas impactadas pelo problema';
