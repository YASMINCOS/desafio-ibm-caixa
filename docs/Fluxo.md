# 🧩 SomoS_Sandbox

## 🌍 Visão Geral
A **SomoS_Sandbox** é uma solução criada para o **Hackathon Brasília Mais TI 2025**, em parceria com a **CAIXA** e **IBM**, com o objetivo de **não deixar boas ideias se perderem**.  

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
    
    B -->|Cadastrar Ideia| C[Agente de Ideias Perguntas guiadas]
    B -->|Registrar Problema| G[Agente de Problemas Perguntas guiadas]

    C --> D[Validação da Ideia]
    G --> H[Validação do Problema]

    D --> E[Agente verifica duplicatas + busca na internet]
    E --> F[Agente de Ideias Semelhantes Consulta base de Problemas]
    F --> I[Registro da Ideia Status=EM_TRIAGEM Resumo JSON]

    H --> J[Registro do Problema Categoria + Resumo JSON]

    I --> K[Avaliação Inicial Categoria + Urgência + Impacto]
    J --> K

    K --> L[Match Inteligente - Ideia ↔ Problema - Exibe duplicatas - Identifica gaps]

    L --> M[Dashboard Final Status, Categorias, Ligações]
