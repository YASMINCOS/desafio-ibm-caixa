CREATE TABLE ideias
(
    id                   VARCHAR(36) PRIMARY KEY,
    nome_proponente      VARCHAR(255) NOT NULL,
    matricula_proponente VARCHAR(255) NOT NULL,
    unidade_proponente   VARCHAR(255) NOT NULL,
    nome_experimento     VARCHAR(255) NOT NULL,
    equipe_envolvida     TEXT         NOT NULL,
    desafio_problema     TEXT         NOT NULL,
    solucao_descricao    TEXT         NOT NULL,
    metodologia_execucao TEXT         NOT NULL,
    hipotese_principal   TEXT         NOT NULL,
    horizonte_inovacao   VARCHAR(10)  NOT NULL,
    baseline_atual       TEXT         NOT NULL,
    resultados_esperados TEXT         NOT NULL,
    kpis_smart           TEXT         NOT NULL,
    categoria            VARCHAR(50)  NOT NULL,
    status               VARCHAR(50)  NOT NULL    DEFAULT 'ABERTO',
    avaliacao_ia         TEXT,
    avaliacao_humana     TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_ideia_categoria CHECK (categoria IN
                                         ('OPERACIONAL', 'TECNOLOGICA', 'ATENDIMENTO', 'COMPLIANCE', 'GESTAO',
                                          'SUSTENTABILIDADE', 'ECOSSISTEMA')),
    CONSTRAINT ck_ideia_status CHECK (status IN ('ABERTO', 'EM_ANALISE', 'VALIDADO', 'REJEITADO', 'IMPLEMENTADO')),
    CONSTRAINT ck_ideia_horizonte CHECK (horizonte_inovacao IN ('H1', 'H2', 'H3'))
);
