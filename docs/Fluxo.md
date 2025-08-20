# 🧩 IdeAcesso – Sandbox CAIXA Inteligente

## 🌍 Visão Geral
O **IdeAcesso** é uma solução criada para o **Hackathon Brasília Mais TI 2025**, em parceria com a **CAIXA** e **IBM**, com o objetivo de **não deixar boas ideias se perderem**.  

A plataforma utiliza **Agentes de IA (Watsonx Orchestrate)** para transformar o fluxo do **Sandbox CAIXA** em um processo **escalável, inclusivo e transparente**, conectando **ideias ↔ problemas** e garantindo que cada colaborador tenha suas propostas avaliadas de forma justa e clara.

---

## 🎯 Objetivo
- Democratizar a submissão de ideias com **perguntas guiadas** (linguagem simples e acessível).  
- Automatizar a **triagem** e a **avaliação** das propostas com justificativas textuais.  
- Detectar **duplicatas** e criar **conexões inteligentes** entre ideias e problemas reais.  
- Fornecer **dashboards e relatórios** para governança e aceleração das melhores iniciativas.  

---

## 🔄 Fluxo Multiagente

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
