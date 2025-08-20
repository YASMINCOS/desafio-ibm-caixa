
CREATE TABLE IF NOT EXISTS ideias
(
    id                   VARCHAR(36) PRIMARY KEY,
    nome_proponente      VARCHAR(255),
    matricula_proponente VARCHAR(255),
    unidade_proponente   VARCHAR(255),
    nome_experimento     VARCHAR(255),
    equipe_envolvida     TEXT,
    desafio_problema     TEXT,
    solucao_descricao    TEXT,
    metodologia_execucao TEXT,
    hipotese_principal   TEXT,
    horizonte_inovacao   VARCHAR(10),
    baseline_atual       TEXT,
    resultados_esperados TEXT,
    kpis_smart           TEXT,
    categoria            VARCHAR(50),
    status               VARCHAR(50) DEFAULT 'ABERTO',
    avaliacao_ia         TEXT,
    avaliacao_humana     TEXT,
    data_criacao         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
