# Fluxo Agentes CAIXA

```mermaid
flowchart TD

    A[Início: Usuário acessa sistema] --> B{Escolher fluxo}
    
    B -->|Cadastrar Ideia| C[Agente de Ideias\nPerguntas guiadas]
    B -->|Registrar Problema| G[Agente de Problemas\nPerguntas guiadas]

    C --> D[Validação da Ideia]
    G --> H[Validação do Problema]

    D --> E[Agente verifica duplicatas\n+ busca na internet]
    E --> F[Agente de Ideias Semelhantes\nConsulta base de Problemas]
    F --> I[Registro da Ideia\nStatus=EM_TRIAGEM\nResumo JSON]

    H --> J[Registro do Problema\nCategoria + Resumo JSON]

    I --> K[Avaliação Inicial\nCategoria + Urgência + Impacto]
    J --> K

    K --> L[Match Inteligente\n- Ideia ↔ Problema\n- Exibe duplicatas\n- Identifica gaps]

    L --> M[Dashboard Final\nStatus, Categorias, Ligações]

