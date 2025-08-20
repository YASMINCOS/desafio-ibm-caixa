"use client";

import React from 'react';
import { 
  Plus, 
  TrendingUp, 
  Zap, 
  Target, 
  Clock, 
  Award,
  ArrowRight,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';

interface QuickActionsPanelProps {
  insights: {
    total: number;
    quickWins: number;
    priorities: number;
    approvalRate: number;
    avgScore: number;
  };
  onAction: (action: string) => void;
}

export default function QuickActionsPanel({ insights, onAction }: QuickActionsPanelProps) {
  const actions = [
    {
      id: 'create',
      title: 'Nova Ideia',
      description: 'Cadastrar nova proposta',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      id: 'quick-wins',
      title: 'Quick Wins',
      description: `${insights.quickWins} ideias prontas`,
      icon: Zap,
      color: 'bg-green-100 hover:bg-green-200',
      textColor: 'text-green-800'
    },
    {
      id: 'priorities',
      title: 'Prioridades',
      description: `${insights.priorities} ideias urgentes`,
      icon: Target,
      color: 'bg-red-100 hover:bg-red-200',
      textColor: 'text-red-800'
    },
    {
      id: 'review',
      title: 'Revisar Pendentes',
      description: 'Ideias aguardando análise',
      icon: Clock,
      color: 'bg-yellow-100 hover:bg-yellow-200',
      textColor: 'text-yellow-800'
    }
  ];

  const recommendations = [
    {
      title: 'Focar em Quick Wins',
      description: 'Priorize ideias de alto impacto e baixa complexidade para resultados rápidos',
      action: 'quick-wins',
      urgent: insights.quickWins > 0
    },
    {
      title: 'Revisar Prioridades',
      description: 'Ideias com alta urgência precisam de atenção imediata',
      action: 'priorities',
      urgent: insights.priorities > 3
    },
    {
      title: 'Melhorar Taxa de Aprovação',
      description: 'Taxa atual está abaixo do ideal, revisar critérios',
      action: 'review',
      urgent: insights.approvalRate < 60
    }
  ];

  return (
    <div className="space-y-6">
      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
          Ações Rápidas
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onAction(action.id)}
                className={`${action.color} ${action.textColor} p-4 rounded-lg transition-all duration-200 transform hover:scale-105`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm opacity-80">{action.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recomendações Inteligentes */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
          Recomendações Inteligentes
        </h3>
        
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.urgent 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    rec.urgent ? 'text-red-900' : 'text-blue-900'
                  }`}>
                    {rec.title}
                    {rec.urgent && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Urgente
                      </span>
                    )}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    rec.urgent ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {rec.description}
                  </p>
                </div>
                <button
                  onClick={() => onAction(rec.action)}
                  className={`ml-4 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    rec.urgent
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Ação
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas de Performance */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Performance do Mês
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{insights.avgScore}</div>
            <div className="text-sm text-green-700">Score Médio</div>
            <div className="text-xs text-green-600 mt-1">+5% vs mês anterior</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{insights.total}</div>
            <div className="text-sm text-blue-700">Ideias Submetidas</div>
            <div className="text-xs text-blue-600 mt-1">+12% vs mês anterior</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{insights.approvalRate}%</div>
            <div className="text-sm text-purple-700">Taxa de Aprovação</div>
            <div className="text-xs text-purple-600 mt-1">Meta: 70%</div>
          </div>
        </div>
      </div>
    </div>
  );
}