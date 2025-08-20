"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Plus, AlertTriangle, BarChart3 } from "lucide-react";
import Sidebar from "./sidebar";
import DashboardStats from "./dashboardstats";
import IdeasTable from "./ideastable";
import ChatMessage from "./chatmessage";
import IdeaCreationModal from './ideacreationmodal';

// Types (inline para evitar problemas de import)
interface Message {
  id: number;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  confidence?: number;
}

interface Idea {
  id: number;
  title: string;
  content: string;
  impact: "Alto" | "Médio" | "Baixo";
  urgency: "Alta" | "Média" | "Baixa";
  complexity: "Alta" | "Média" | "Baixa";
  status: "Em Análise" | "Aprovada" | "Rejeitada" | "Implementada";
  timestamp: Date;
  author: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}

type ActiveView = "dashboard" | "chat" | "ideas" | "problems" | "analytics";

// Watson Chat Service (inline)
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

      if (!response.ok) {
        throw new Error(`Erro na análise: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Erro na análise da ideia");
      }

      return data.data;
    } catch (error) {
      console.error("Erro na análise da ideia:", error);
      // Fallback para análise local
      return this.fallbackAnalysis(ideaText);
    }
  }

  private fallbackAnalysis(ideaText: string): any {
    const text = ideaText.toLowerCase();

    const impactKeywords = [
      "inovação",
      "revolucionar",
      "transformar",
      "disruptivo",
      "novo",
      "melhorar",
    ];
    const urgencyKeywords = [
      "urgente",
      "imediato",
      "crítico",
      "emergencial",
      "rapidamente",
    ];
    const complexityKeywords = [
      "sistema",
      "integração",
      "algoritmo",
      "automação",
      "inteligência",
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

    return {
      impact: impactScore > 2 ? "Alto" : impactScore > 0 ? "Médio" : "Baixo",
      urgency: urgencyScore > 1 ? "Alta" : urgencyScore > 0 ? "Média" : "Baixa",
      complexity:
        complexityScore > 2 ? "Alta" : complexityScore > 0 ? "Média" : "Baixa",
      category: this.categorizeIdea(text),
      feasibility: Math.min(
        90,
        Math.max(40, 70 - complexityScore * 10 + impactScore * 5)
      ),
      estimatedTime:
        complexityScore > 2
          ? "6-12 meses"
          : complexityScore > 0
          ? "3-6 meses"
          : "1-3 meses",
      requiredResources: ["Equipe técnica", "Orçamento aprovado"],
      confidence: 0.6,
    };
  }

  private categorizeIdea(text: string): string {
    if (text.includes("mobile") || text.includes("app")) return "Mobile";
    if (text.includes("web") || text.includes("site")) return "Web";
    if (text.includes("ia") || text.includes("inteligência"))
      return "Inteligência Artificial";
    if (text.includes("automação")) return "Automação";
    if (text.includes("dados")) return "Análise de Dados";
    return "Geral";
  }

  clearSession(): void {
    this.conversationId = null;
  }
}

// Instância do serviço
const chatService = new WatsonChatService();

export default function MainApp() {
  // Chat states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "agent",
      content:
        "Olá! Sou o Agente Sandbox CAIXA integrado com IBM Watson. Estou aqui para ajudá-lo a registrar, classificar e avaliar suas ideias inovadoras. Compartilhe sua ideia comigo!",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // App states
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: 1,
      title: "Sistema de Atendimento Inteligente",
      content:
        "Implementar chatbot com IA para melhorar atendimento ao cliente",
      impact: "Alto",
      urgency: "Média",
      complexity: "Alta",
      status: "Em Análise",
      timestamp: new Date("2024-01-15"),
      author: "Maria Silva",
    },
    {
      id: 2,
      title: "App Mobile para Funcionários",
      content:
        "Desenvolvimento de aplicativo mobile para facilitar processos internos",
      impact: "Médio",
      urgency: "Alta",
      complexity: "Média",
      status: "Aprovada",
      timestamp: new Date("2024-01-14"),
      author: "João Santos",
    },
    {
      id: 3,
      title: "Automação de Relatórios",
      content: "Sistema automatizado para geração de relatórios gerenciais",
      impact: "Alto",
      urgency: "Baixa",
      complexity: "Baixa",
      status: "Implementada",
      timestamp: new Date("2024-01-13"),
      author: "Ana Costa",
    },
    {
      id: 4,
      title: "Portal de Autoatendimento",
      content:
        "Plataforma web para clientes realizarem operações básicas online",
      impact: "Médio",
      urgency: "Média",
      complexity: "Média",
      status: "Em Análise",
      timestamp: new Date("2024-01-12"),
      author: "Carlos Lima",
    },
    {
      id: 5,
      title: "Sistema de Notificações Push",
      content:
        "Implementar notificações inteligentes baseadas no perfil do usuário",
      impact: "Baixo",
      urgency: "Baixa",
      complexity: "Baixa",
      status: "Rejeitada",
      timestamp: new Date("2024-01-11"),
      author: "Fernanda Rocha",
    },
  ]);

  const [user] = useState<UserProfile>({
    id: "1",
    name: "Sarah Morgans",
    email: "sarah.morgans@caixa.gov.br",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b2f85095?w=100&h=100&fit=crop&crop=face",
    role: "Analista de Inovação",
    department: "Tecnologia e Inovação",
  });

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeView === "chat") {
      scrollToBottom();
    }
  }, [messages, activeView]);

  const handleSendMessage = async (): Promise<void> => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);
    setConnectionStatus("connecting");

    try {
      // Enviar mensagem para Watson via API
      const watsonResponse = await chatService.sendMessage(
        currentInput,
        user.id
      );

      setConnectionStatus("connected");

      // Verificar se é uma ideia para análise
      const isIdea =
        currentInput.length > 20 &&
        (currentInput.toLowerCase().includes("ideia") ||
          currentInput.toLowerCase().includes("proposta") ||
          currentInput.toLowerCase().includes("sugestão") ||
          currentInput.toLowerCase().includes("implementar") ||
          currentInput.toLowerCase().includes("criar") ||
          currentInput.toLowerCase().includes("desenvolver"));

      let ideaAnalysis = null;
      if (isIdea) {
        try {
          ideaAnalysis = await chatService.analyzeIdea(currentInput, user.id);

          // Adicionar nova ideia à lista
          const newIdea: Idea = {
            id: ideas.length + 1,
            title: `Ideia #${ideas.length + 1}`,
            content:
              currentInput.substring(0, 100) +
              (currentInput.length > 100 ? "..." : ""),
            impact: ideaAnalysis.impact,
            urgency: ideaAnalysis.urgency,
            complexity: ideaAnalysis.complexity,
            status: "Em Análise",
            timestamp: new Date(),
            author: user.name,
          };

          setIdeas((prev) => [...prev, newIdea]);
        } catch (analysisError) {
          console.error("Erro na análise da ideia:", analysisError);
        }
      }

      // Preparar resposta do agente
      let agentContent = watsonResponse.response;

      if (ideaAnalysis) {
        agentContent += `\n\n📊 **Análise da Ideia:**\n• Impacto: ${ideaAnalysis.impact}\n• Urgência: ${ideaAnalysis.urgency}\n• Complexidade: ${ideaAnalysis.complexity}\n• Categoria: ${ideaAnalysis.category}\n• Viabilidade: ${ideaAnalysis.feasibility}%\n• Tempo estimado: ${ideaAnalysis.estimatedTime}`;
      }

      const agentResponse: Message = {
        id: messages.length + 2,
        type: "agent",
        content: agentContent,
        timestamp: new Date(),
        confidence: watsonResponse.confidence,
      };

      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setConnectionStatus("disconnected");

      // Resposta de fallback em caso de erro
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "agent",
        content:
          "Desculpe, estou enfrentando dificuldades de conexão no momento. Por favor, tente novamente em alguns instantes. Posso ajudá-lo com análise básica de ideias enquanto isso.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600";
      case "connecting":
        return "text-yellow-600";
      case "disconnected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Watson Conectado";
      case "connecting":
        return "Conectando...";
      case "disconnected":
        return "Desconectado";
      default:
        return "Status desconhecido";
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Sistema integrado com IBM Watson Orchestrate
              </p>
            </div>
            <DashboardStats />
            <IdeasTable
              ideas={ideas.slice(0, 5)}
              onView={(idea) => handleIdeaAction("view", idea)}
              onEdit={(idea) => handleIdeaAction("edit", idea)}
              onDelete={(idea) => handleIdeaAction("delete", idea)}
            />
          </div>
        );

      case "ideas":
        return (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ideias</h1>
                <p className="text-gray-600">
                  Gerencie todas as ideias submetidas
                </p>
              </div>
              <button
                onClick={() => handleIdeaAction('create')}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: "#005CAA" }}
              >
                <Plus className="w-4 h-4" />
                <span>Nova Ideia</span>
              </button>
            </div>
            <IdeasTable
              ideas={ideas}
              onView={(idea) => handleIdeaAction("view", idea)}
              onEdit={(idea) => handleIdeaAction("edit", idea)}
              onDelete={(idea) => handleIdeaAction("delete", idea)}
            />
          </div>
        );

      case "problems":
        return (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Problemas</h1>
                <p className="text-gray-600">
                  Acompanhe e resolva problemas reportados
                </p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Reportar Problema</span>
              </button>
            </div>
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Funcionalidade em Desenvolvimento
              </h3>
              <p className="text-gray-500">
                O módulo de problemas estará disponível em breve.
              </p>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Análises</h1>
              <p className="text-gray-600">Relatórios e métricas do sistema</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Dashboard de Análises
              </h3>
              <p className="text-gray-500">
                Relatórios detalhados e métricas avançadas em breve.
              </p>
            </div>
          </div>
        );

      case "chat":
        return (
          <div className="flex h-full">
            <div className="flex-1 flex flex-col bg-white">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Chat com Agente IA
                    </h2>
                    <p className="text-sm text-gray-500">
                      Integrado com IBM Watson Orchestrate
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        connectionStatus === "connected"
                          ? "bg-green-500"
                          : connectionStatus === "connecting"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className={`text-sm ${getConnectionStatusColor()}`}>
                      {getConnectionStatusText()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-xs">
                      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua ideia aqui..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 resize-none"
                    style={{ color: "#3A485A" }}
                    rows={2}
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === "" || isTyping}
                    className="px-6 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ backgroundColor: "#005CAA" }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
// Adicionar no estado do componente MainApp:
const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);

// Atualizar a função handleIdeaAction:
const handleIdeaAction = (action: string, idea?: Idea) => {
  if (action === 'create') {
    setIsIdeaModalOpen(true);
  } else if (idea) {
    console.log(`${action} idea:`, idea);
    // Implementar outras ações (view, edit, delete)
  }
};

// Adicionar função para lidar com sucesso da criação:
const handleIdeaCreationSuccess = (newIdea: any) => {
  // Adicionar a nova ideia à lista
  setIdeas(prev => [newIdea, ...prev]);
  
  // Mostrar notificação de sucesso
  alert('Ideia criada com sucesso!');
  
  // Opcional: navegar para a aba de ideias
  setActiveView('ideas');
};

  return (
    <div className="h-screen flex" style={{ backgroundColor: "#F6F6F6" }}>
      {/* Header with Logo */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-6 z-10">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-white"
            style={{ backgroundColor: "#005CAA" }}
          >
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: "#005CAA" }}>
              Sandbox CAIXA
            </h1>
            <p className="text-xs text-gray-500">Powered by IBM Watson</p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 z-20">
        <Sidebar
          user={user}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 mt-16 overflow-auto">{renderContent()}</div>
        
      {/* Modal de Criação de Ideia */}
      <IdeaCreationModal
      isOpen={isIdeaModalOpen}
      onClose={() => setIsIdeaModalOpen(false)}
      onSuccess={handleIdeaCreationSuccess}
      currentUser={user}
    />
    </div>
  );
}
