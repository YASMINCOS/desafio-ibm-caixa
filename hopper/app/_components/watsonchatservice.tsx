// Watson Chat Service
class WatsonChatService {
  private conversationId: string | null = null;

  async sendMessage(message: string, userId: string): Promise<any> {
    try {
      // Tentar conectar com Watson primeiro
      const response = await fetch("/api/watson/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId,
          conversationId: this.conversationId,
          metadata: {
            source: "caixa-sandbox",
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          // Watson funcionando - usar resposta real
          if (data.data.conversationId) {
            this.conversationId = data.data.conversationId;
          }

          return {
            response: data.data.message || "Resposta não disponível",
            confidence: data.data.metadata?.confidence || 0.8,
            conversationId: data.data.conversationId,
          };
        }
      }

      // Se Watson falhar, usar fallback local
      console.log("Watson indisponível, usando resposta local");
      return this.generateLocalResponse(message, userId);
    } catch (error) {
      console.log("Erro na conexão Watson, usando fallback local:", error);
      // Fallback local em caso de erro
      return this.generateLocalResponse(message, userId);
    }
  }

  private generateLocalResponse(message: string, userId: string): any {
    // Gerar conversationId se não existir
    if (!this.conversationId) {
      this.conversationId = `local_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }

    // Respostas inteligentes baseadas no conteúdo da mensagem
    const lowerMessage = message.toLowerCase();
    let response = "";

    if (
      lowerMessage.includes("olá") ||
      lowerMessage.includes("oi") ||
      lowerMessage.includes("bom dia")
    ) {
      response =
        "Olá! Como posso ajudá-lo hoje? Estou aqui para analisar suas ideias e sugestões de inovação.";
    } else if (
      lowerMessage.includes("ideia") ||
      lowerMessage.includes("proposta") ||
      lowerMessage.includes("sugestão")
    ) {
      response =
        "Interessante! Vou analisar sua ideia. Com base no que você descreveu, posso avaliar o impacto, urgência e complexidade da implementação.";
    } else if (
      lowerMessage.includes("como") &&
      lowerMessage.includes("funciona")
    ) {
      response =
        "Sou um assistente de inovação que ajuda a avaliar e classificar ideias. Você pode me contar suas propostas e eu fornecerei uma análise detalhada incluindo impacto, urgência e complexidade.";
    } else if (
      lowerMessage.includes("implementar") ||
      lowerMessage.includes("desenvolver") ||
      lowerMessage.includes("criar")
    ) {
      response =
        "Ótima iniciativa! Para projetos de implementação, é importante considerar recursos necessários, cronograma e possíveis riscos. Posso ajudar a estruturar sua proposta.";
    } else if (
      lowerMessage.includes("automação") ||
      lowerMessage.includes("automatizar")
    ) {
      response =
        "Automação é uma excelente área para inovação! Pode trazer grandes benefícios em eficiência e redução de custos. Conte-me mais detalhes sobre o processo que você gostaria de automatizar.";
    } else if (
      lowerMessage.includes("mobile") ||
      lowerMessage.includes("app") ||
      lowerMessage.includes("aplicativo")
    ) {
      response =
        "Aplicações mobile são muito relevantes hoje! Precisamos considerar a experiência do usuário, plataformas (Android/iOS), e integração com sistemas existentes. Qual seria o objetivo principal do app?";
    } else if (
      lowerMessage.includes("ia") ||
      lowerMessage.includes("inteligência artificial") ||
      lowerMessage.includes("machine learning")
    ) {
      response =
        "Inteligência Artificial tem um potencial transformador enorme! É importante definir bem o problema que a IA vai resolver e ter dados de qualidade para treinamento. Que processo você gostaria de otimizar com IA?";
    } else if (
      lowerMessage.includes("dados") ||
      lowerMessage.includes("analytics") ||
      lowerMessage.includes("relatório")
    ) {
      response =
        "Análise de dados é fundamental para tomada de decisões! Podemos explorar dashboards, relatórios automatizados ou até mesmo insights preditivos. Que tipo de informação seria mais valiosa?";
    } else if (
      lowerMessage.includes("segurança") ||
      lowerMessage.includes("proteção")
    ) {
      response =
        "Segurança é sempre prioridade! Precisamos balancear proteção com usabilidade. Conte-me mais sobre os aspectos de segurança que você gostaria de melhorar.";
    } else if (
      lowerMessage.includes("obrigado") ||
      lowerMessage.includes("valeu") ||
      lowerMessage.includes("muito bom")
    ) {
      response =
        "Fico feliz em ajudar! Estou sempre aqui para analisar suas ideias e contribuir com o processo de inovação. Tem mais alguma proposta para discutirmos?";
    } else if (
      lowerMessage.includes("tchau") ||
      lowerMessage.includes("até logo") ||
      lowerMessage.includes("fim")
    ) {
      response =
        "Até logo! Foi um prazer ajudar com suas ideias. Volte sempre que quiser discutir novas propostas de inovação!";
    } else {
      // Resposta genérica inteligente
      response = `Entendo sua proposta sobre "${message.substring(0, 50)}${
        message.length > 50 ? "..." : ""
      }". Vou analisar os aspectos técnicos e de negócio para fornecer uma avaliação completa. Esta ideia tem potencial interessante!`;
    }

    return {
      response,
      confidence: 0.8,
      conversationId: this.conversationId,
      source: "local_fallback",
    };
  }

  async analyzeIdea(ideaText: string, userId: string): Promise<any> {
    try {
      // Tentar usar Watson primeiro
      const response = await fetch("/api/watson/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ideaText,
          userId,
          conversationId: this.conversationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.data;
        }
      }

      // Se Watson falhar, usar análise local
      console.log("Watson análise indisponível, usando análise local");
      return this.fallbackAnalysis(ideaText);
    } catch (error) {
      console.log("Erro na análise Watson, usando fallback local:", error);
      // Sempre usar fallback em caso de erro
      return this.fallbackAnalysis(ideaText);
    }
  }

  private fallbackAnalysis(ideaText: string): any {
    const text = ideaText.toLowerCase();

    // Análise mais sofisticada de palavras-chave
    const impactKeywords = [
      "inovação",
      "revolucionar",
      "transformar",
      "disruptivo",
      "novo",
      "melhorar",
      "otimizar",
      "eficiência",
    ];
    const urgencyKeywords = [
      "urgente",
      "imediato",
      "crítico",
      "emergencial",
      "rapidamente",
      "prioridade",
      "agora",
    ];
    const complexityKeywords = [
      "sistema",
      "integração",
      "algoritmo",
      "automação",
      "inteligência",
      "machine learning",
      "blockchain",
      "api",
    ];

    const impactScore = impactKeywords.filter((keyword) =>
      text.includes(keyword)
    ).length;
    const urgencyScore = urgencyKeywords.filter((keyword) =>
      text.includes(keyword)
    ).length;
    const complexityScore = complexityKeywords.filter((keyword) =>
      text.includes(keyword)
    ).length;

    // Análise de tamanho e detalhamento
    const lengthFactor = Math.min(ideaText.length / 200, 1); // Ideias mais detalhadas podem ter maior impacto
    const adjustedImpactScore = impactScore + lengthFactor * 2;

    // Cálculo de viabilidade baseado em complexidade vs impacto
    const feasibilityBase = 70;
    const feasibilityAdjustment = adjustedImpactScore * 5 - complexityScore * 8;
    const feasibility = Math.min(
      95,
      Math.max(30, feasibilityBase + feasibilityAdjustment)
    );

    // Estimativa de tempo baseada na complexidade
    let estimatedTime = "1-3 meses";
    if (complexityScore > 3) estimatedTime = "9-12 meses";
    else if (complexityScore > 2) estimatedTime = "6-9 meses";
    else if (complexityScore > 1) estimatedTime = "3-6 meses";

    // Recursos necessários baseados em complexidade e impacto
    const resources = ["Equipe técnica"];
    if (complexityScore > 1) resources.push("Arquiteto de solução");
    if (complexityScore > 2) resources.push("Especialista em infraestrutura");
    if (adjustedImpactScore > 2) resources.push("Gerente de projeto");
    if (adjustedImpactScore > 3) resources.push("Stakeholders executivos");
    if (complexityScore > 1 || adjustedImpactScore > 2)
      resources.push("Orçamento aprovado");

    return {
      impact:
        adjustedImpactScore > 3
          ? "Alto"
          : adjustedImpactScore > 1
          ? "Médio"
          : "Baixo",
      urgency: urgencyScore > 1 ? "Alta" : urgencyScore > 0 ? "Média" : "Baixa",
      complexity:
        complexityScore > 2 ? "Alta" : complexityScore > 0 ? "Média" : "Baixa",
      category: this.categorizeIdea(text),
      feasibility: Math.round(feasibility),
      estimatedTime,
      requiredResources: resources,
      confidence: 0.75, // Confiança da análise local
      analysisDetails: {
        impactScore: Math.round(adjustedImpactScore),
        urgencyScore,
        complexityScore,
        keywordsFound: {
          impact: impactKeywords.filter((keyword) => text.includes(keyword)),
          urgency: urgencyKeywords.filter((keyword) => text.includes(keyword)),
          complexity: complexityKeywords.filter((keyword) =>
            text.includes(keyword)
          ),
        },
      },
    };
  }

  private categorizeIdea(text: string): string {
    // Categorização mais abrangente
    const categories = {
      OPERACIONAL: [
        "operação",
        "processo",
        "workflow",
        "automação",
        "otimização",
        "eficiência",
      ],
      TECNOLOGICA: [
        "tecnologia",
        "sistema",
        "software",
        "hardware",
        "digital",
        "tech",
      ],
      ATENDIMENTO: [
        "atendimento",
        "cliente",
        "suporte",
        "service",
        "relacionamento",
        "experiência",
      ],
      COMPLIANCE: [
        "compliance",
        "regulamentação",
        "norma",
        "auditoria",
        "conformidade",
        "legal",
      ],
      GESTAO: [
        "gestão",
        "gerenciamento",
        "administração",
        "controle",
        "supervisão",
        "coordenação",
      ],
      SUSTENTABILIDADE: [
        "sustentabilidade",
        "verde",
        "ecológico",
        "ambiental",
        "renovável",
        "carbono",
      ],
      ECOSSISTEMA: [
        "ecossistema",
        "parceiros",
        "integração",
        "colaboração",
        "network",
        "comunidade",
      ],
      VAREJO: ["varejo", "venda", "loja", "comercial", "produto", "mercado"],
      "NEGOCIOS DE ATACADO": [
        "atacado",
        "distribuição",
        "fornecedor",
        "bulk",
        "volume",
        "wholesale",
      ],
      HABITACAO: [
        "habitação",
        "moradia",
        "casa",
        "imóvel",
        "residencial",
        "financiamento",
      ],
      GOVERNO: [
        "governo",
        "público",
        "municipal",
        "estadual",
        "federal",
        "setor público",
      ],
      "FUNDO DE INVESTIMENTO": [
        "investimento",
        "fundo",
        "aplicação",
        "capital",
        "portfolio",
        "ativo",
      ],
      "FINANCAS E CONTROLADORIA": [
        "finanças",
        "controladoria",
        "contabilidade",
        "orçamento",
        "fiscal",
        "financeiro",
      ],
      "LOGISTICAS, OPERACOES E SEGURANCA": [
        "logística",
        "operações",
        "segurança",
        "transporte",
        "distribuição",
        "supply",
      ],
      RISCOS: [
        "risco",
        "risk",
        "compliance",
        "controle",
        "mitigação",
        "exposição",
      ],
      PESSOAS: [
        "pessoas",
        "rh",
        "recursos humanos",
        "colaborador",
        "funcionário",
        "talento",
      ],
      Mobile: [
        "mobile",
        "app",
        "aplicativo",
        "smartphone",
        "tablet",
        "android",
        "ios",
      ],
      Web: ["web", "site", "portal", "plataforma", "browser", "online"],
      "Inteligência Artificial": [
        "ia",
        "inteligência",
        "machine learning",
        "ai",
        "algoritmo",
        "neural",
        "chatbot",
      ],
      Automação: [
        "automação",
        "automatizar",
        "robô",
        "bot",
        "workflow",
        "processo",
      ],
      "Análise de Dados": [
        "dados",
        "analytics",
        "big data",
        "relatório",
        "dashboard",
        "métricas",
        "kpi",
      ],
      Segurança: [
        "segurança",
        "security",
        "proteção",
        "criptografia",
        "autenticação",
        "firewall",
      ],
      Blockchain: [
        "blockchain",
        "crypto",
        "descentralizado",
        "bitcoin",
        "ethereum",
      ],
      "UX/UI": [
        "ux",
        "ui",
        "interface",
        "usabilidade",
        "experiência",
        "design",
        "front",
      ],
      Cloud: ["nuvem", "cloud", "aws", "azure", "google cloud", "serverless"],
      "API/Integração": [
        "api",
        "integração",
        "microserviços",
        "webhook",
        "rest",
        "graphql",
      ],
      IoT: [
        "iot",
        "internet das coisas",
        "sensores",
        "dispositivos",
        "conectados",
      ],
      DevOps: ["devops", "ci/cd", "deploy", "docker", "kubernetes", "pipeline"],
      "E-commerce": ["e-commerce", "loja", "vendas", "pagamento", "checkout"],
      Financeiro: [
        "financeiro",
        "banking",
        "pagamento",
        "transação",
        "crédito",
      ],
    };

    const lowerText = text.toLowerCase();

    // Procurar categoria com mais matches - priorizar categorias da CAIXA
    let bestCategory = "GERAL";
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(categories)) {
      const matches = keywords.filter((keyword) =>
        lowerText.includes(keyword)
      ).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestCategory = category;
      }
    }

    return bestCategory;
  }

  clearSession(): void {
    this.conversationId = null;
  }
}

export default WatsonChatService;
