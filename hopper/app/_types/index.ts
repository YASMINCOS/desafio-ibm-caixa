export interface Message {
  id: number;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface Idea {
  id: number;
  title: string;
  content: string;
  impact: 'Alto' | 'Médio' | 'Baixo';
  urgency: 'Alta' | 'Média' | 'Baixa';
  complexity: 'Alta' | 'Média' | 'Baixa';
  status: 'Em Análise' | 'Aprovada' | 'Rejeitada' | 'Implementada';
  timestamp: Date;
  author: string;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'Aberto' | 'Em Progresso' | 'Resolvido' | 'Fechado';
  timestamp: Date;
  assignee?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}

export type ActiveView = 'dashboard' | 'chat' | 'ideas' | 'problems' | 'analytics';