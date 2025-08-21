"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Star, 
  TrendingUp, 
  Clock, 
  Brain, 
  Target,
  ChevronDown,
  Award,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  MoreVertical,
  Calendar,
  User,
  Tag,
  BarChart3
} from 'lucide-react';

interface Idea {
  id: number;
  title: string;
  content: string;
  impact: 'Alto' | 'Médio' | 'Baixo';
  urgency: 'Alta' | 'Média' | 'Baixa';
  complexity: 'Alta' | 'Média' | 'Baixa';
  status: 'Em Análise' | 'Aprovada' | 'Rejeitada' | 'Implementada';
  timestamp: Date;
  author: string;
  category?: string;
  apiData?: any;
  score?: number;
  feasibility?: number;
}

interface FilterState {
  search: string;
  impact: string[];
  urgency: string[];
  complexity: string[];
  status: string[];
  category: string[];
  scoreRange: [number, number];
  feasibilityRange: [number, number];
  dateRange: 'all' | '7d' | '30d' | '90d';
}

interface DashboardCardsProps {
  ideas: Idea[];
  onIdeaClick?: (idea: Idea) => void;
  onIdeaAction?: (action: string, idea: Idea) => void;
}

export default function DashboardCards({ ideas, onIdeaClick, onIdeaAction }: DashboardCardsProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    impact: [],
    urgency: [],
    complexity: [],
    status: [],
    category: [],
    scoreRange: [0, 100],
    feasibilityRange: [0, 100],
    dateRange: 'all'
  });

  const [sortBy, setSortBy] = useState<'score' | 'date' | 'impact' | 'urgency'>('score');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Calcular score para cada ideia
  const ideasWithScore = useMemo(() => {
    return ideas.map(idea => ({
      ...idea,
      score: calculateIdeaScore(idea),
      feasibility: idea.feasibility || calculateFeasibility(idea)
    }));
  }, [ideas]);

  // Filtrar e ordenar ideias
  const filteredIdeas = useMemo(() => {
    let filtered = ideasWithScore.filter(idea => {
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!idea.title.toLowerCase().includes(searchLower) &&
            !idea.content.toLowerCase().includes(searchLower) &&
            !idea.author.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtros de categoria
      if (filters.impact.length > 0 && !filters.impact.includes(idea.impact)) return false;
      if (filters.urgency.length > 0 && !filters.urgency.includes(idea.urgency)) return false;
      if (filters.complexity.length > 0 && !filters.complexity.includes(idea.complexity)) return false;
      if (filters.status.length > 0 && !filters.status.includes(idea.status)) return false;
      if (filters.category.length > 0 && idea.category && !filters.category.includes(idea.category)) return false;

      // Filtros de range
      if (idea.score < filters.scoreRange[0] || idea.score > filters.scoreRange[1]) return false;
      if (idea.feasibility < filters.feasibilityRange[0] || idea.feasibility > filters.feasibilityRange[1]) return false;

      // Filtro de data
      if (filters.dateRange !== 'all') {
        const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90;
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        if (idea.timestamp < cutoff) return false;
      }

      return true;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'date':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'impact':
          return getImpactValue(b.impact) - getImpactValue(a.impact);
        case 'urgency':
          return getUrgencyValue(b.urgency) - getUrgencyValue(a.urgency);
        default:
          return 0;
      }
    });

    return filtered;
  }, [ideasWithScore, filters, sortBy]);

  // Insights e métricas
  const insights = useMemo(() => {
    const total = filteredIdeas.length;
    const highImpact = filteredIdeas.filter(i => i.impact === 'Alto').length;
    const highUrgency = filteredIdeas.filter(i => i.urgency === 'Alta').length;
    const lowComplexity = filteredIdeas.filter(i => i.complexity === 'Baixa').length;
    const approved = filteredIdeas.filter(i => i.status === 'Aprovada').length;
    const avgScore = total > 0 ? filteredIdeas.reduce((sum, i) => sum + i.score, 0) / total : 0;
    const avgFeasibility = total > 0 ? filteredIdeas.reduce((sum, i) => sum + i.feasibility, 0) / total : 0;

    const quickWins = filteredIdeas.filter(i => 
      i.impact === 'Alto' && i.complexity === 'Baixa' && i.status === 'Em Análise'
    ).length;

    const priorities = filteredIdeas.filter(i => 
      i.impact === 'Alto' && i.urgency === 'Alta'
    ).length;

    return {
      total,
      highImpact,
      highUrgency,
      lowComplexity,
      approved,
      avgScore: Math.round(avgScore),
      avgFeasibility: Math.round(avgFeasibility),
      quickWins,
      priorities,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0
    };
  }, [filteredIdeas]);

  function calculateIdeaScore(idea: Idea): number {
    const impactScore = getImpactValue(idea.impact) * 0.4;
    const urgencyScore = getUrgencyValue(idea.urgency) * 0.3;
    const complexityScore = (4 - getComplexityValue(idea.complexity)) * 0.2; // Invertido
    const statusScore = getStatusValue(idea.status) * 0.1;
    
    return Math.round((impactScore + urgencyScore + complexityScore + statusScore) * 10);
  }

  function calculateFeasibility(idea: Idea): number {
    const baseScore = 60;
    const impactBonus = getImpactValue(idea.impact) * 10;
    const complexityPenalty = getComplexityValue(idea.complexity) * 15;
    const urgencyBonus = getUrgencyValue(idea.urgency) * 5;
    
    return Math.max(10, Math.min(100, baseScore + impactBonus - complexityPenalty + urgencyBonus));
  }

  function getImpactValue(impact: string): number {
    return { 'Alto': 3, 'Médio': 2, 'Baixo': 1 }[impact] || 1;
  }

  function getUrgencyValue(urgency: string): number {
    return { 'Alta': 3, 'Média': 2, 'Baixa': 1 }[urgency] || 1;
  }

  function getComplexityValue(complexity: string): number {
    return { 'Alta': 3, 'Média': 2, 'Baixa': 1 }[complexity] || 1;
  }

  function getStatusValue(status: string): number {
    return { 'Implementada': 4, 'Aprovada': 3, 'Em Análise': 2, 'Rejeitada': 1 }[status] || 1;
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFilterValue = (key: keyof FilterState, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      impact: [],
      urgency: [],
      complexity: [],
      status: [],
      category: [],
      scoreRange: [0, 100],
      feasibilityRange: [0, 100],
      dateRange: 'all'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Implementada': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Aprovada': return <Award className="w-4 h-4 text-blue-600" />;
      case 'Em Análise': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Rejeitada': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (idea: Idea) => {
    if (idea.impact === 'Alto' && idea.complexity === 'Baixa') {
      return { label: 'Quick Win', color: 'bg-green-100 text-green-800', icon: <Zap className="w-3 h-3" /> };
    }
    if (idea.impact === 'Alto' && idea.urgency === 'Alta') {
      return { label: 'Prioridade', color: 'bg-red-100 text-red-800', icon: <Target className="w-3 h-3" /> };
    }
    if (idea.score >= 80) {
      return { label: 'Top Score', color: 'bg-purple-100 text-purple-800', icon: <Star className="w-3 h-3" /> };
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Insights Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Ideias</p>
              <p className="text-2xl font-bold">{insights.total}</p>
              <p className="text-blue-100 text-xs">Score médio: {insights.avgScore}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Quick Wins</p>
              <p className="text-2xl font-bold">{insights.quickWins}</p>
              <p className="text-green-100 text-xs">Alto impacto, baixa complexidade</p>
            </div>
            <Zap className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Prioridades</p>
              <p className="text-2xl font-bold">{insights.priorities}</p>
              <p className="text-purple-100 text-xs">Alto impacto e urgência</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Taxa de Aprovação</p>
              <p className="text-2xl font-bold">{insights.approvalRate}%</p>
              <p className="text-orange-100 text-xs">Viabilidade média: {insights.avgFeasibility}%</p>
            </div>
            <Award className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Controles e Filtros */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Busca */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ideias..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">Ordenar por Score</option>
              <option value="date">Ordenar por Data</option>
              <option value="impact">Ordenar por Impacto</option>
              <option value="urgency">Ordenar por Urgência</option>
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'compact' : 'grid')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'grid' ? 'Compacto' : 'Grade'}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Filtros de Categoria */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Impacto</h4>
                <div className="space-y-2">
                  {['Alto', 'Médio', 'Baixo'].map(value => (
                    <label key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.impact.includes(value)}
                        onChange={() => toggleFilterValue('impact', value)}
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{value}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Urgência</h4>
                <div className="space-y-2">
                  {['Alta', 'Média', 'Baixa'].map(value => (
                    <label key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.urgency.includes(value)}
                        onChange={() => toggleFilterValue('urgency', value)}
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{value}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
                <div className="space-y-2">
                  {['Em Análise', 'Aprovada', 'Rejeitada', 'Implementada'].map(value => (
                    <label key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(value)}
                        onChange={() => toggleFilterValue('status', value)}
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtros de Range */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Score: {filters.scoreRange[0]} - {filters.scoreRange[1]}
                </h4>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.scoreRange[1]}
                  onChange={(e) => updateFilter('scoreRange', [filters.scoreRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Viabilidade: {filters.feasibilityRange[0]}% - {filters.feasibilityRange[1]}%
                </h4>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.feasibilityRange[1]}
                  onChange={(e) => updateFilter('feasibilityRange', [filters.feasibilityRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Filtros de Data */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Período</h4>
              <div className="flex space-x-4">
                {[
                  { value: 'all', label: 'Todos' },
                  { value: '7d', label: '7 dias' },
                  { value: '30d', label: '30 dias' },
                  { value: '90d', label: '90 dias' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="dateRange"
                      value={option.value}
                      checked={filters.dateRange === option.value}
                      onChange={(e) => updateFilter('dateRange', e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ações dos Filtros */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards de Ideias */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredIdeas.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhuma ideia encontrada</p>
              <p className="text-sm">Tente ajustar os filtros ou busca</p>
            </div>
          </div>
        ) : (
          filteredIdeas.map(idea => {
            const priority = getPriorityBadge(idea);
            
            return (
              <div
                key={idea.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
                  viewMode === 'compact' ? 'p-4' : 'p-6'
                }`}
                onClick={() => onIdeaClick?.(idea)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold text-gray-900 line-clamp-2 ${
                        viewMode === 'compact' ? 'text-sm' : 'text-lg'
                      }`}>
                        {idea.title}
                      </h3>
                      {priority && (
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                          {priority.icon}
                          <span>{priority.label}</span>
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-gray-600 line-clamp-2 ${
                      viewMode === 'compact' ? 'text-xs' : 'text-sm'
                    }`}>
                      {idea.content}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(idea.score)}`}>
                      <Star className="w-3 h-3" />
                      <span>{idea.score}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onIdeaAction?.('menu', idea);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Métricas */}
                <div className={`grid grid-cols-3 gap-4 mb-4 ${
                  viewMode === 'compact' ? 'text-xs' : 'text-sm'
                }`}>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-blue-600" />
                      <span className="text-gray-500">Impacto</span>
                    </div>
                    <span className={`font-medium ${
                      idea.impact === 'Alto' ? 'text-green-600' :
                      idea.impact === 'Médio' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {idea.impact}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="w-3 h-3 text-orange-600" />
                      <span className="text-gray-500">Urgência</span>
                    </div>
                    <span className={`font-medium ${
                      idea.urgency === 'Alta' ? 'text-red-600' :
                      idea.urgency === 'Média' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {idea.urgency}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Brain className="w-3 h-3 text-purple-600" />
                      <span className="text-gray-500">Complexidade</span>
                    </div>
                    <span className={`font-medium ${
                      idea.complexity === 'Baixa' ? 'text-green-600' :
                      idea.complexity === 'Média' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {idea.complexity}
                    </span>
                  </div>
                </div>

                {/* Viabilidade Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Viabilidade</span>
                    <span className="text-xs font-medium text-gray-700">{idea.feasibility}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idea.feasibility >= 80 ? 'bg-green-500' :
                        idea.feasibility >= 60 ? 'bg-blue-500' :
                        idea.feasibility >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${idea.feasibility}%` }}
                    ></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(idea.status)}
                      <span className={`text-xs font-medium ${
                        idea.status === 'Implementada' ? 'text-green-600' :
                        idea.status === 'Aprovada' ? 'text-blue-600' :
                        idea.status === 'Em Análise' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {idea.status}
                      </span>
                    </div>

                    {idea.category && (
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{idea.category}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{idea.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(idea.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resumo dos Filtros */}
      {filteredIdeas.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Mostrando {filteredIdeas.length} de {ideasWithScore.length} ideias
          {filters.search && ` • Busca: "${filters.search}"`}
          {(filters.impact.length > 0 || filters.urgency.length > 0 || filters.status.length > 0) && ' • Filtros ativos'}
        </div>
      )}
    </div>
  );
}