import { watsonOrchestrate, WatsonOrchestrateChatResponse } from './watson-orchestrate-api';

export interface ChatSession {
  conversationId: string;
  userId: string;
  channelId: string;
  createdAt: Date;
  lastActivity: Date;
  messageCount: number;
}

export class WatsonChatService {
  private static instance: WatsonChatService;
  private sessions: Map<string, ChatSession> = new Map();

  static getInstance(): WatsonChatService {
    if (!WatsonChatService.instance) {
      WatsonChatService.instance = new WatsonChatService();
    }
    return WatsonChatService.instance;
  }

  // Iniciar nova sessão de chat
  async createSession(userId: string): Promise<ChatSession> {
    const conversationId = this.generateConversationId();
    const session: ChatSession = {
      conversationId,
      userId,
      channelId: 'caixa-sandbox-channel',
      createdAt: new Date(),
      lastActivity: new Date(),
      messageCount: 0,
    };

    this.sessions.set(conversationId, session);
    return session;
  }

  // Enviar mensagem via Watson
  async sendMessage(
    message: string, 
    userId: string, 
    conversationId?: string
  ): Promise<WatsonOrchestrateChatResponse> {
    try {
      // Obter ou criar sessão
      let session = conversationId ? this.sessions.get(conversationId) : null;
      if (!session) {
        session = await this.createSession(userId);
        conversationId = session.conversationId;
      }

      // Atualizar atividade da sessão
      session.lastActivity = new Date();
      session.messageCount++;

      // Enviar via API
      const response = await fetch('/api/watson/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId,
          conversationId,
          metadata: {
            sessionId: session.conversationId,
            messageCount: session.messageCount,
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro na comunicação com Watson');
      }

      return data.data;
    } catch (error) {
      console.error('Erro no WatsonChatService:', error);
      throw error;
    }
  }

  // Analisar ideia
  async analyzeIdea(
    ideaText: string, 
    userId: string, 
    conversationId?: string
  ): Promise<any> {
    try {
      const response = await fetch('/api/watson/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaText,
          userId,
          conversationId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro na análise da ideia');
      }

      return data.data;
    } catch (error) {
      console.error('Erro na análise da ideia:', error);
      throw error;
    }
  }

  // Verificar status do Watson
  async checkStatus(): Promise<any> {
    try {
      const response = await fetch('/api/watson/status');
      const data = await response.json();
      return data.success ? data.data : { status: 'offline' };
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      return { status: 'offline', error: error.message };
    }
  }

  // Obter histórico da conversa
  async getConversationHistory(conversationId: string): Promise<WatsonOrchestrateChatResponse[]> {
    try {
      return await watsonOrchestrate.getConversationHistory(conversationId);
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }

  // Limpar sessão
  clearSession(conversationId: string): void {
    this.sessions.delete(conversationId);
  }

  // Obter sessão ativa
  getSession(conversationId: string): ChatSession | undefined {
    return this.sessions.get(conversationId);
  }

  // Gerar ID de conversa
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Limpar sessões antigas (> 24h)
  cleanupOldSessions(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    for (const [conversationId, session] of this.sessions.entries()) {
      if (session.lastActivity < oneDayAgo) {
        this.sessions.delete(conversationId);
      }
    }
  }
}

export const watsonChatService = WatsonChatService.getInstance();