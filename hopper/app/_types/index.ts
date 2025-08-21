export interface Message {
  id: number;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
}

export interface Idea {
  id: number;
  title: string;
  content: string;
  category: string;
  impact: "Alto" | "Médio" | "Baixo";
  urgency: "Alta" | "Média" | "Baixa";
  complexity: "Alta" | "Média" | "Baixa";
  status: "Em Análise" | "Aprovada" | "Rejeitada" | "Implementada";
  timestamp: Date;
  author: string;
  score?: number;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  content: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Aberto" | "Em Progresso" | "Resolvido" | "Fechado";
  timestamp: Date;
  author?: string;
  score?: number;
  category: string;
  impact: "Alto" | "Médio" | "Baixo";
  urgency: "Alta" | "Média" | "Baixa";
  complexity: "Alta" | "Média" | "Baixa";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}

export type ActiveView =
  | "dashboard"
  | "chat"
  | "ideas"
  | "problems"
  | "analytics";
