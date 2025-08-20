/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WatsonOrchestrateChatRequest {
  message: string;
  conversationId?: string;
  channelId: string;
  userId: string;
  metadata?: {
    timezone?: string;
    locale?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface WatsonOrchestrateChatResponse {
  conversationId: string;
  message: string;
  messageId: string;
  timestamp: string;
  source: 'bot' | 'user';
  metadata?: {
    confidence?: number;
    skills?: Array<{
      skillId: string;
      skillName: string;
      confidence: number;
    }>;
    actions?: Array<{
      actionId: string;
      actionName: string;
      parameters?: any;
    }>;
  };
  attachments?: Array<{
    type: 'text' | 'image' | 'file' | 'card';
    content: any;
  }>;
}

export interface WatsonChannelConfig {
  channelId: string;
  name: string;
  description: string;
  type: 'web' | 'api' | 'custom';
  settings: {
    webhookUrl?: string;
    apiKey: string;
    enableLogging: boolean;
    maxMessageLength: number;
  };
}

class WatsonOrchestrate {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly instanceId: string;
  private readonly channelId: string;
  private readonly headers: HeadersInit;

  constructor() {
    this.baseUrl = 'https://api.eu-gb.watson-orchestrate.cloud.ibm.com';
    this.instanceId = 'ac89ebf4-26a5-44e4-ac21-50f0a9bb63ce';
    this.apiKey = 'eTUp0AwV818LY2Kg-yeyt9Hb8GXawvUamrXx4dluFeDN';
    this.channelId = 'caixa-sandbox-channel'; // Você precisa criar este canal
    
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'User-Agent': 'CAIXA-Sandbox/1.0.0',
    };
  }

  // Criar canal de comunicação
  async createChannel(config: Partial<WatsonChannelConfig>): Promise<WatsonChannelConfig> {
    try {
      const channelConfig: WatsonChannelConfig = {
        channelId: config.channelId || `caixa-channel-${Date.now()}`,
        name: config.name || 'CAIXA Sandbox Channel',
        description: config.description || 'Canal para Sistema de Ideias CAIXA',
        type: config.type || 'api',
        settings: {
          apiKey: this.apiKey,
          enableLogging: true,
          maxMessageLength: 4000,
          ...config.settings,
        },
      };

      const response = await fetch(`${this.baseUrl}/instances/${this.instanceId}/channels`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(channelConfig),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro ao criar canal: ${response.status} - ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar canal Watson:', error);
      throw error;
    }
  }

  // Listar canais existentes
  async listChannels(): Promise<WatsonChannelConfig[]> {
    try {
      const response = await fetch(`${this.baseUrl}/instances/${this.instanceId}/channels`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar canais: ${response.status}`);
      }

      const data = await response.json();
      return data.channels || [];
    } catch (error) {
      console.error('Erro ao listar canais:', error);
      return [];
    }
  }

  // Enviar mensagem via canal
  async sendMessage(request: WatsonOrchestrateChatRequest): Promise<WatsonOrchestrateChatResponse> {
    try {
      const payload = {
        message: request.message,
        conversationId: request.conversationId,
        userId: request.userId,
        metadata: {
          timezone: 'America/Sao_Paulo',
          locale: 'pt-BR',
          source: 'caixa-sandbox',
          timestamp: new Date().toISOString(),
          ...request.metadata,
        },
      };

      const response = await fetch(
        `${this.baseUrl}/instances/${this.instanceId}/channels/${this.channelId}/messages`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Watson API Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        conversationId: data.conversationId || request.conversationId || this.generateConversationId(),
        message: data.message || data.response?.text || 'Resposta não disponível',
        messageId: data.messageId || `msg_${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        source: 'bot',
        metadata: {
          confidence: data.confidence || data.response?.confidence || 0.8,
          skills: data.skills || [],
          actions: data.actions || [],
          ...data.metadata,
        },
        attachments: data.attachments || [],
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem Watson:', error);
      throw error;
    }
  }

  // Obter histórico de conversa
  async getConversationHistory(conversationId: string, limit: number = 50): Promise<WatsonOrchestrateChatResponse[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/instances/${this.instanceId}/channels/${this.channelId}/conversations/${conversationId}/messages?limit=${limit}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao obter histórico: ${response.status}`);
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }

  // Analisar ideia usando skills específicas do Watson
  async analyzeIdeaWithSkills(ideaText: string, userId: string, conversationId?: string): Promise<any> {
    try {
      const analysisPrompt = `
        Por favor, analise a seguinte ideia de inovação usando as skills de análise disponíveis:
        
        IDEIA: "${ideaText}"
        
        Preciso de uma análise estruturada incluindo:
        1. Nível de Impacto (Alto/Médio/Baixo)
        2. Urgência de implementação (Alta/Média/Baixa)
        3. Complexidade técnica (Alta/Média/Baixa)
        4. Categoria/Área de aplicação
        5. Viabilidade técnica (porcentagem)
        6. Tempo estimado de implementação
        7. Recursos necessários
        8. Riscos identificados
        9. Benefícios esperados
        
        Formate a resposta como JSON estruturado.
      `;

      const response = await this.sendMessage({
        message: analysisPrompt,
        userId,
        conversationId,
        channelId: this.channelId,
        metadata: {
          intent: 'analyze_idea',
          ideaText,
          analysisType: 'comprehensive',
        },
      });

      return this.parseAnalysisResponse(response, ideaText);
    } catch (error) {
      console.error('Erro na análise de ideia:', error);
      throw error;
    }
  }

  // Executar ação específica via Watson
  async executeAction(actionId: string, parameters: any, userId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/instances/${this.instanceId}/actions/${actionId}/execute`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            parameters,
            userId,
            channelId: this.channelId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao executar ação: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao executar ação:', error);
      throw error;
    }
  }

  // Verificar status da instância Watson
  async getInstanceStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/instances/${this.instanceId}/status`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao verificar status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  // Parse da resposta de análise
  private parseAnalysisResponse(response: WatsonOrchestrateChatResponse, originalIdea: string): any {
    try {
      // Tentar extrair JSON da resposta
      const jsonMatch = response.message.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          impact: this.normalizeValue(analysis.impacto || analysis.impact, ['Alto', 'Médio', 'Baixo'], 'Médio'),
          urgency: this.normalizeValue(analysis.urgencia || analysis.urgency, ['Alta', 'Média', 'Baixa'], 'Média'),
          complexity: this.normalizeValue(analysis.complexidade || analysis.complexity, ['Alta', 'Média', 'Baixa'], 'Média'),
          category: analysis.categoria || analysis.category || this.categorizeIdea(originalIdea),
          feasibility: analysis.viabilidade || analysis.feasibility || 70,
          estimatedTime: analysis.tempo || analysis.estimatedTime || '3-6 meses',
          requiredResources: analysis.recursos || analysis.resources || ['Equipe técnica', 'Orçamento'],
          risks: analysis.riscos || analysis.risks || ['Risco tecnológico', 'Risco de prazo'],
          benefits: analysis.beneficios || analysis.benefits || ['Melhoria de eficiência'],
          confidence: response.metadata?.confidence || 0.8,
          rawResponse: response.message,
        };
      }
    } catch (error) {
      console.error('Erro ao fazer parse da análise:', error);
    }

    // Fallback para análise básica
    return this.createFallbackAnalysis(originalIdea);
  }

  // Normalizar valores da resposta
  private normalizeValue(value: any, allowedValues: string[], defaultValue: string): string {
    if (typeof value === 'string' && allowedValues.includes(value)) {
      return value;
    }
    return defaultValue;
  }

  // Categorizar ideia
  private categorizeIdea(text: string): string {
    const categories = {
      'Mobile': ['mobile', 'app', 'aplicativo', 'smartphone'],
      'Web': ['web', 'site', 'portal', 'plataforma'],
      'IA/ML': ['ia', 'inteligência', 'machine learning', 'ai', 'algoritmo'],
      'Automação': ['automação', 'automatizar', 'robô', 'bot'],
      'Dados': ['dados', 'analytics', 'big data', 'relatório'],
      'Segurança': ['segurança', 'security', 'proteção', 'criptografia'],
      'Blockchain': ['blockchain', 'crypto', 'descentralizado'],
      'UX/UI': ['ux', 'ui', 'interface', 'usabilidade', 'experiência'],
      'Cloud': ['nuvem', 'cloud', 'aws', 'azure'],
      'API': ['api', 'integração', 'microserviços', 'webhook'],
    };

    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return category;
      }
    }
    return 'Geral';
  }

  // Análise de fallback
  private createFallbackAnalysis(ideaText: string): any {
    const text = ideaText.toLowerCase();
    const impactScore = this.countKeywords(text, ['inovação', 'revolucionar', 'transformar', 'disruptivo']);
    const urgencyScore = this.countKeywords(text, ['urgente', 'imediato', 'crítico', 'emergencial']);
    const complexityScore = this.countKeywords(text, ['sistema', 'integração', 'algoritmo', 'automação']);

    return {
      impact: impactScore > 2 ? 'Alto' : impactScore > 0 ? 'Médio' : 'Baixo',
      urgency: urgencyScore > 1 ? 'Alta' : urgencyScore > 0 ? 'Média' : 'Baixa',
      complexity: complexityScore > 2 ? 'Alta' : complexityScore > 0 ? 'Média' : 'Baixa',
      category: this.categorizeIdea(text),
      feasibility: Math.min(90, Math.max(40, 70 - (complexityScore * 10) + (impactScore * 5))),
      estimatedTime: complexityScore > 2 ? '6-12 meses' : complexityScore > 0 ? '3-6 meses' : '1-3 meses',
      requiredResources: this.getRequiredResources(complexityScore, impactScore),
      risks: ['Análise detalhada necessária'],
      benefits: ['Potencial de melhoria identificado'],
      confidence: 0.6,
      rawResponse: 'Análise local realizada',
    };
  }

  private countKeywords(text: string, keywords: string[]): number {
    return keywords.filter(keyword => text.includes(keyword)).length;
  }

  private getRequiredResources(complexityScore: number, impactScore: number): string[] {
    const resources = ['Equipe de desenvolvimento'];
    if (complexityScore > 1) resources.push('Arquiteto de solução');
    if (complexityScore > 2) resources.push('Especialista em infraestrutura');
    if (impactScore > 1) resources.push('Gerente de projeto');
    if (impactScore > 2) resources.push('Stakeholders executivos');
    resources.push('Orçamento aprovado');
    return resources;
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const watsonOrchestrate = new WatsonOrchestrate();