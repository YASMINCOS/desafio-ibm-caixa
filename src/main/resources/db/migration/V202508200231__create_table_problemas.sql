-- Criar tabela PROBLEMAS com campos mais flexíveis
CREATE TABLE IF NOT EXISTS problemas
(
    id                    VARCHAR(36) PRIMARY KEY,
    nome                  VARCHAR(255),
    matricula             VARCHAR(255),
    unidade               VARCHAR(255),
    email                 VARCHAR(255),
    problema_descricao    TEXT,
    processo              TEXT,
    categoria             VARCHAR(50),
    impacto_financeiro    DECIMAL(10, 2),
    tipo_solucao_esperada TEXT,
    status                VARCHAR(50) DEFAULT 'ABERTO',
    matching_score        DOUBLE,
    data_criacao          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    impacto_pessoas       INTEGER
    );

