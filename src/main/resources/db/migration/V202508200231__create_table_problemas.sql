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

-- ============================================
-- CONSTRAINTS OPCIONAIS (se quiser adicionar depois)
-- ============================================

-- Constraints para IDEIAS (execute apenas se necessário)
-- ALTER TABLE ideias ADD CONSTRAINT ck_ideia_categoria 
--     CHECK (categoria IS NULL OR categoria IN ('OPERACIONAL', 'TECNOLOGICA', 'ATENDIMENTO', 'COMPLIANCE', 'GESTAO', 'SUSTENTABILIDADE', 'ECOSSISTEMA'));

-- ALTER TABLE ideias ADD CONSTRAINT ck_ideia_status 
--     CHECK (status IS NULL OR status IN ('ABERTO', 'EM_ANALISE', 'VALIDADO', 'REJEITADO', 'IMPLEMENTADO'));

-- ALTER TABLE ideias ADD CONSTRAINT ck_ideia_horizonte 
--     CHECK (horizonte_inovacao IS NULL OR horizonte_inovacao IN ('H1', 'H2', 'H3'));

-- Constraints para PROBLEMAS (execute apenas se necessário)  
-- ALTER TABLE problemas ADD CONSTRAINT ck_problema_categoria 
--     CHECK (categoria IS NULL OR categoria IN ('OPERACIONAL', 'TECNOLOGICA', 'ATENDIMENTO', 'COMPLIANCE', 'GESTAO', 'SUSTENTABILIDADE', 'ECOSSISTEMA'));

-- ALTER TABLE problemas ADD CONSTRAINT ck_problema_status 
--     CHECK (status IS NULL OR status IN ('ABERTO', 'EM_ANALISE', 'VALIDADO', 'REJEITADO', 'IMPLEMENTADO'));

-- ============================================
-- ÍNDICES (sempre úteis para performance)
-- ============================================

-- Índices para IDEIAS
CREATE INDEX IF NOT EXISTS idx_ideias_status ON ideias (status);
CREATE INDEX IF NOT EXISTS idx_ideias_categoria ON ideias (categoria);
CREATE INDEX IF NOT EXISTS idx_ideias_nome_proponente ON ideias (nome_proponente);
CREATE INDEX IF NOT EXISTS idx_ideias_data_criacao ON ideias (data_criacao);
CREATE INDEX IF NOT EXISTS idx_ideias_status_categoria ON ideias (status, categoria);

-- Índices para PROBLEMAS
CREATE INDEX IF NOT EXISTS idx_problemas_status ON problemas (status);
CREATE INDEX IF NOT EXISTS idx_problemas_categoria ON problemas (categoria);
CREATE INDEX IF NOT EXISTS idx_problemas_email ON problemas (email);
CREATE INDEX IF NOT EXISTS idx_problemas_nome ON problemas (nome);
CREATE INDEX IF NOT EXISTS idx_problemas_matching_score ON problemas (matching_score);
CREATE INDEX IF NOT EXISTS idx_problemas_data_criacao ON problemas (data_criacao);
CREATE INDEX IF NOT EXISTS idx_problemas_status_categoria ON problemas (status, categoria);
