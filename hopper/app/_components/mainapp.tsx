"use client";

import React, { useState, useEffect } from "react";
import { Bot, Plus, AlertTriangle, BarChart3 } from "lucide-react";
import Sidebar from "./sidebar";
import Dashboard from "./dashboard";
import Chat from "./chat";
import IdeasTable from "./ideastable";
import WatsonChatService from "./watsonchatservice";
import { Idea, Message, Problem, User } from "../_types";

// Importação dinâmica do WatsonxChat para evitar problemas de SSR
import dynamic from "next/dynamic";
import ProblemTable from "./problemtable";
import Image from "next/image";

const WatsonxChat = dynamic(() => import("./watsonxchat"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">Carregando watsonx Chat...</p>
      </div>
    </div>
  ),
});

// Configuração do watsonx Orchestrate
interface WatsonxConfig {
  orchestrationID: string;
  hostURL: string;
  crn: string;
  agentId: string;
  agentEnvironmentId: string;
}

type ActiveView = "dashboard" | "ideas" | "problems" | "analytics";

// Instância do serviço Watson
const chatService = new WatsonChatService();

export default function MainApp() {
  const [isClient, setIsClient] = useState(false);

  // Configuração do watsonx Orchestrate com valores reais
  const [watsonxConfig] = useState<WatsonxConfig>({
    orchestrationID:
      "27826d743e244fb2ab37032e04663caf_ac89ebf4-26a5-44e4-ac21-50f0a9bb63ce",
    hostURL: "https://eu-gb.watson-orchestrate.cloud.ibm.com",
    crn: "crn:v1:bluemix:public:watsonx-orchestrate:eu-gb:a/27826d743e244fb2ab37032e04663caf:ac89ebf4-26a5-44e4-ac21-50f0a9bb63ce::",
    agentId: "153fd93c-a591-4743-804c-820f1946db8f",
    agentEnvironmentId: "b54cfa85-9608-4669-8eb1-a609fef3e5ea",
  });

  // Estados do chat local
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

  // Estados da aplicação
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [showChatWidget, setShowChatWidget] = useState(false);
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
      category: "ATENDIMENTO",
      score: 85,
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
      category: "ATENDIMENTO",
      score: 78,
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
      category: "ATENDIMENTO",
      score: 92,
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
      category: "VAREJO",
      score: 72,
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
      category: "TECNOLOGICA",
      score: 45,
    },
    {
      id: 6,
      title: "Sistema de Gestão de Riscos",
      content:
        "Plataforma integrada para monitoramento e análise de riscos operacionais e financeiros em tempo real",
      impact: "Alto",
      urgency: "Alta",
      complexity: "Alta",
      status: "Aprovada",
      timestamp: new Date("2024-01-10"),
      author: "Roberto Silva",
      category: "RISCOS",
      score: 88,
    },
    {
      id: 7,
      title: "Portal de Compliance",
      content:
        "Sistema para monitoramento automático de conformidade regulatória e geração de relatórios",
      impact: "Alto",
      urgency: "Média",
      complexity: "Média",
      status: "Em Análise",
      timestamp: new Date("2024-01-09"),
      author: "Patricia Santos",
      category: "COMPLIANCE",
      score: 83,
    },
    {
      id: 8,
      title: "Programa de Sustentabilidade Digital",
      content:
        "Iniciativas para redução do impacto ambiental através de tecnologias verdes e eficiência energética",
      impact: "Médio",
      urgency: "Baixa",
      complexity: "Média",
      status: "Aprovada",
      timestamp: new Date("2024-01-08"),
      author: "Lucas Verde",
      category: "SUSTENTABILIDADE",
      score: 68,
    },
  ]);

  const [problems, setProblems] = useState<Problem[]>([
    {
      id: 1,
      title: "Sistema de Atendimento Lento",
      description:
        "Sistema de atendimento apresenta lentidão durante picos de demanda",
      content:
        "Sistema de atendimento fica lento durante picos de demanda, causando insatisfação dos clientes e perda de produtividade da equipe. O problema é mais crítico durante horários comerciais e finais de semana.",
      priority: "Alta",
      status: "Aberto",
      timestamp: new Date("2025-08-20T04:18:13Z"),
      author: "Maria Santos",
      score: 85,
      category: "TECNOLOGICA",
      impact: "Alto",
      urgency: "Alta",
      complexity: "Média",
    },
    {
      id: 2,
      title: "Falhas no Sistema de Pagamento",
      description:
        "Falhas recorrentes no processamento de pagamentos aos finais de semana",
      content:
        "Falhas recorrentes no sistema de pagamento durante finais de semana, resultando em perda de vendas e insatisfação dos clientes. O sistema apresenta timeouts e erros de conexão com frequência.",
      priority: "Alta",
      status: "Em Progresso",
      timestamp: new Date("2025-08-19T10:30:45Z"),
      author: "João Silva",
      score: 92,
      category: "TECNOLOGICA",
      impact: "Alto",
      urgency: "Alta",
      complexity: "Alta",
    },
    {
      id: 3,
      title: "Processo Manual de Aprovação de Férias",
      description:
        "Processo manual gera atrasos e retrabalho na gestão de férias",
      content:
        "Processo manual de aprovação de férias gera atrasos e retrabalho, impactando a produtividade da equipe de RH e causando insatisfação dos funcionários com demoras nas aprovações.",
      priority: "Média",
      status: "Aberto",
      timestamp: new Date("2025-08-18T14:22:30Z"),
      author: "Ana Costa",
      score: 68,
      category: "OPERACIONAL",
      impact: "Médio",
      urgency: "Média",
      complexity: "Baixa",
    },
    {
      id: 4,
      title: "Dados Inconsistentes em Relatórios",
      description: "Relatórios financeiros apresentam dados inconsistentes",
      content:
        "Relatórios financeiros são gerados com dados inconsistentes, causando problemas na tomada de decisão e necessidade de retrabalho constante para validação das informações.",
      priority: "Alta",
      status: "Resolvido",
      timestamp: new Date("2025-08-17T09:15:20Z"),
      author: "Carlos Oliveira",
      score: 78,
      category: "TECNOLOGICA",
      impact: "Alto",
      urgency: "Média",
      complexity: "Média",
    },
    {
      id: 5,
      title: "Sistema de Compliance Inadequado",
      description:
        "Sistema não consegue rastrear transações suspeitas adequadamente",
      content:
        "Sistema de compliance não consegue rastrear adequadamente as transações suspeitas, criando riscos regulatórios e possíveis penalidades para a instituição.",
      priority: "Alta",
      status: "Em Progresso",
      timestamp: new Date("2025-08-16T16:45:10Z"),
      author: "Fernanda Lima",
      score: 95,
      category: "COMPLIANCE",
      impact: "Alto",
      urgency: "Alta",
      complexity: "Alta",
    },
    {
      id: 6,
      title: "Análise de Crédito Demorada",
      description:
        "Demora excessiva na análise de risco de crédito impacta experiência",
      content:
        "Demora excessiva na análise de risco de crédito, impactando a experiência do cliente e resultando em perda de negócios por abandono do processo de solicitação.",
      priority: "Alta",
      status: "Aberto",
      timestamp: new Date("2025-08-15T11:30:00Z"),
      author: "Roberto Santos",
      score: 82,
      category: "OPERACIONAL",
      impact: "Alto",
      urgency: "Alta",
      complexity: "Alta",
    },
    {
      id: 7,
      title: "Alto Consumo Energético dos Servidores",
      description:
        "Infraestrutura atual consome energia excessiva aumentando custos",
      content:
        "Alto consumo energético dos servidores aumenta custos operacionais e impacto ambiental, contrariando as metas de sustentabilidade da empresa.",
      priority: "Média",
      status: "Em Progresso",
      timestamp: new Date("2025-08-14T08:20:15Z"),
      author: "Patricia Rocha",
      score: 65,
      category: "SUSTENTABILIDADE",
      impact: "Médio",
      urgency: "Baixa",
      complexity: "Média",
    },
    {
      id: 8,
      title: "Crashes no App Mobile Android",
      description:
        "Aplicativo apresenta crashes frequentes em dispositivos antigos",
      content:
        "Aplicativo mobile apresenta crashes frequentes em dispositivos Android antigos, afetando uma parcela significativa da base de usuários e gerando avaliações negativas na loja.",
      priority: "Média",
      status: "Aberto",
      timestamp: new Date("2025-08-13T13:10:25Z"),
      author: "Lucas Verde",
      score: 72,
      category: "TECNOLOGICA",
      impact: "Médio",
      urgency: "Média",
      complexity: "Baixa",
    },
    {
      id: 9,
      title: "Backup de Dados Falho",
      description: "Sistema de backup apresenta falhas intermitentes",
      content:
        "Sistema de backup de dados apresenta falhas intermitentes, criando riscos de perda de informações críticas e violação de políticas de segurança da informação.",
      priority: "Alta",
      status: "Aberto",
      timestamp: new Date("2025-08-12T07:45:30Z"),
      author: "Sandra Costa",
      score: 88,
      category: "TECNOLOGICA",
      impact: "Alto",
      urgency: "Alta",
      complexity: "Média",
    },
    {
      id: 10,
      title: "Processo de Onboarding Ineficiente",
      description: "Novo processo de integração de funcionários é muito lento",
      content:
        "Processo de onboarding de novos funcionários é ineficiente e demorado, resultando em baixa produtividade inicial e insatisfação dos novos colaboradores.",
      priority: "Baixa",
      status: "Fechado",
      timestamp: new Date("2025-08-11T15:20:45Z"),
      author: "Marcos Silva",
      score: 45,
      category: "OPERACIONAL",
      impact: "Baixo",
      urgency: "Baixa",
      complexity: "Baixa",
    },
  ]);

  const [user] = useState<User>({
    id: "1",
    name: "Sarah Morgans",
    email: "sarah.morgans@caixa.gov.br",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b2f85095?w=100&h=100&fit=crop&crop=face",
    role: "Analista de Inovação",
    department: "Tecnologia e Inovação",
  });

  // Verificar se está no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Função para calcular score de uma ideia
  const calculateIdeaScore = (idea: Idea): number => {
    if (idea.score !== undefined) {
      return idea.score;
    }

    const getImpactValue = (impact: string): number => {
      return { Alto: 3, Médio: 2, Baixo: 1 }[impact] || 1;
    };

    const getUrgencyValue = (urgency: string): number => {
      return { Alta: 3, Média: 2, Baixa: 1 }[urgency] || 1;
    };

    const getComplexityValue = (complexity: string): number => {
      return { Alta: 3, Média: 2, Baixa: 1 }[complexity] || 1;
    };

    const getStatusValue = (status: string): number => {
      return (
        { Implementada: 4, Aprovada: 3, "Em Análise": 2, Rejeitada: 1 }[
          status
        ] || 1
      );
    };

    const impactScore = getImpactValue(idea.impact) * 0.4;
    const urgencyScore = getUrgencyValue(idea.urgency) * 0.3;
    const complexityScore = (4 - getComplexityValue(idea.complexity)) * 0.2;
    const statusScore = getStatusValue(idea.status) * 0.1;

    return Math.round(
      (impactScore + urgencyScore + complexityScore + statusScore) * 10
    );
  };

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
      const watsonResponse = await chatService.sendMessage(
        currentInput,
        user.id
      );
      setConnectionStatus("connected");

      const agentResponse: Message = {
        id: messages.length + 2,
        type: "agent",
        content: watsonResponse.response,
        timestamp: new Date(),
        confidence: watsonResponse.confidence,
      };

      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setConnectionStatus("disconnected");

      const errorResponse: Message = {
        id: messages.length + 2,
        type: "agent",
        content:
          "Desculpe, estou enfrentando dificuldades de conexão no momento. Por favor, tente novamente em alguns instantes.",
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

  const handleIdeaAction = (action: string, idea: Idea) => {
    console.log(`${action} idea:`, idea);
  };

  const renderContent = () => {
    if (!isClient) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded mb-4"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            ideas={ideas}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setActiveView={setActiveView}
            calculateIdeaScore={calculateIdeaScore}
            handleIdeaAction={handleIdeaAction}
          />
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
            </div>
            <ProblemTable
              problems={problems}
              onView={(problem) => handleIdeaAction("view", problem)}
              onEdit={(problem) => handleIdeaAction("edit", problem)}
              onDelete={(problem) => handleIdeaAction("delete", problem)}
            />
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

      default:
        return null;
    }
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
            <Image
              src="/logoSandBox.jpg"
              width={500}
              height={500}
              alt="Logo SandBox CAIXA"
            />
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

      {/* Floating Chat Widget */}
      {showChatWidget && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col overflow-hidden">
            {/* Header do Chat Widget */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">AI Assistant</h3>
                    <p className="text-xs text-blue-100">watsonx Orchestrate</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatWidget(false)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conteúdo do Chat */}
            <div className="flex-1 relative">
              <WatsonxChat
                orchestrationID={watsonxConfig.orchestrationID}
                hostURL={watsonxConfig.hostURL}
                crn={watsonxConfig.crn}
                agentId={watsonxConfig.agentId}
                agentEnvironmentId={watsonxConfig.agentEnvironmentId}
                showLauncher={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!showChatWidget && (
        <button
          onClick={() => setShowChatWidget(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />

          {/* Notification dot */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          </span>

          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat com AI Assistant
            <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}
    </div>
  );
}
