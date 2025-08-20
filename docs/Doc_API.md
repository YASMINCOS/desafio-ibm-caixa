DOCUMENTAÇÃO API
----------------

PROBLEMAS
---------

GET

*   **pegar problemas com ideias**: retornar todos os problemas com ideias já cadastradas.
    
*   **listar todos os problemas**: retorna todos os problemas cadastrados.
    
*   **buscar problema por ID**: retorna um problema com ID correspondente ao enviado pela URL.
    
*   **buscar problemas por Status**: retornar os problemas agrupados por status, todos os problemas com status X.
    
*   **buscar problemas por Email**: retornar os problemas de acordo com o e-mail registrado no agente que corresponda ao e-mail passado na URL.
    
*   **buscar problemas por matching score**: buscar ideias com base no cálculo sobre a relação de relevância entre ideia e problema.
    

POST

*   **Criar problema**: cadastrar um problema no sistema.JSON{ "nome": "Maria Santos", "matricula": "789012", "unidade": "Operações - Atendimento", "email": "maria.santos@empresa.com", "problema Descricao": "Sistema de atendimento fica lento durante picos de demanda, causando insatisfação dos clientes", "processo": "Atendimento ao Cliente", "categoria": "TECNOLOGICA", "impacto Financeiro": 50000.00, "tipoSolucao Esperada": "Otimização de performance do sistema ou nova arquitetura", "impacto Pessoas": 150}
    
    *   **JSON**:
        

PUT

*   **Atualizar problema**: atualizar um problema já existente no sistema.JSON{ "nome": "Maria Santos Silva", "matricula": "789012", "unidade": "Operações - Atendimento", "email": "maria.santos@empresa.com", "problema Descricao": "Sistema de atendimento fica muito lento durante picos de demanda, causando grande insatisfação dos clientes", "processo": "Atendimento ao Cliente", "categoria": "TECNOLOGICA", "impacto Financeiro": 75000.00, "tipoSolucaoEsperada": "Otimização de performance do sistema ou nova arquitetura com cache", "impacto Pessoas": 200}
    
    *   **JSON**:
        
*   **Atualizar Status do Problema**: atualizar o status do problema de acordo com o filtro, diretamente pela URL.
    
*   **Atualizar Matching Score**: atualizar o matching score do problema de acordo com o filtro, diretamente pela URL.
    

DELETE

*   **Deletar problema**: excluir um problema.
    

**IDEIAS**
----------

GET

*   **Listar todas as ideias**: retorna todas as ideias registradas no sistema.
    
*   **Buscar Ideia por ID**: retorna ideia com ID correspondente ao enviado pela URL.
    
*   **Buscar ideias por Status**: filtra ideias de acordo com o status.
    

POST

*   **Criar ideia**:```json
*    cadastra uma nova ideia no sistema.JSON{ "nomeProponente": "João Silva", "matricula Proponente": "123456", "unidade Proponente": "TI - Desenvolvimento", "nomeExperimento": "Sistema de Cache Inteligente", "equipe Envolvida": "Equipe de Backend, DevOps e QA", "desafio Problema": "Lentidão no sistema durante picos de acesso", "solucaoDescricao": "Implementação de sistema de cache distribuído com Redis", "metodologia Execucao": "Desenvolvimento incremental com testes A/B", "hipotese Principal": "Cache distribuído reduzirá tempo de resposta em 70%", "horizontelnovacao": "Curto", "baselineAtual": "Tempo médio de resposta: 2.5 segundos", "resultados Esperados": "Redução para 0.8 segundos no tempo de resposta", "kpisSmart": "Tempo de resposta < 1s em 95% das requisições", "categoria": "OPERACIONAL", "avaliacaolA": "Proposta tecnicamente viável com alto impacto", "avaliacaoHumana": "Aprovada para desenvolvimento"}
    ´´´
    *   **JSON**:
        

PUT

*   **Atualizar ideia**: atualiza uma ideia já cadastrada.JSON{ "nomeProponente": "João Silva Santos", "matricula Proponente": "123456", "unidade Proponente": "TI - Desenvolvimento", "nomeExperimento": "Sistema de Cache Inteligente v2", "equipe Envolvida": "Equipe de Backend, DevOps, QA e Arquitetura", "desafioProblema": "Lentidão no sistema durante picos de acesso e alta concorrência", "solucaoDescricao": "Implementação de sistema de cache distribuído com Redis e CDN", "metodologia Execucao": "Desenvolvimento incremental com testes A/B e monitoramento", "hipotese Principal": "Cache distribuído + CDN reduzirá tempo de resposta em 80%", "horizontelnovacao": "Curto prazo - 4 meses", "baselineAtual": "Tempo médio de resposta: 2.5 segundos", "resultados Esperados": "Redução para 0.5 segundos no tempo de resposta", "kpisSmart": "Tempo de resposta < 0.8s em 98% das requisições", "categoria": "TECNOLOGICA", "avaliacaolA": "Proposta tecnicamente viável com altíssimo impacto", "avaliacaoHumana": "Aprovada com prioridade alta"}
    
    *   **JSON**:
        
*   **Atualizar status da ideia**: atualiza o status de uma ideia já cadastrada pelo filtro, na própria URL.
    
*   **Atualizar avaliação humana**: atualizar a avaliação da ideia feita por um avaliador.
    
    *   **JSON**: "Proposta aprovada pela comissão técnica. Recursos alocados para Q1 2024. Excelente alinhamento com objetivos estratégicos."
        

DELETE

*   **Deletar ideia**: deletar ideia cadastrada
