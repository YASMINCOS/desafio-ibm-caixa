import React from 'react';
import { Zap, Target } from 'lucide-react';
import { Idea } from '../_types';

interface IdeaCardDetailedProps {
  idea: Idea & { score: number };
  variant: 'excellent' | 'good';
  onClick: () => void;
}

const IdeaCardDetailed: React.FC<IdeaCardDetailedProps> = ({ idea, variant, onClick }) => {
  const isQuickWin = idea.impact === 'Alto' && idea.complexity === 'Baixa';
  const isPriority = idea.impact === 'Alto' && idea.urgency === 'Alta';
  
  const getScoreStyle = (score: number) => {
    if (score >= 95) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-500 shadow-lg';
    if (score >= 90) return 'bg-green-500 text-white border-green-600 shadow-md';
    if (score >= 80) return 'bg-blue-500 text-white border-blue-600';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'OPERACIONAL': 'bg-blue-100 text-blue-800',
      'TECNOLOGICA': 'bg-purple-100 text-purple-800',
      'ATENDIMENTO': 'bg-green-100 text-green-800',
      'COMPLIANCE': 'bg-red-100 text-red-800',
      'GESTAO': 'bg-orange-100 text-orange-800',
      'SUSTENTABILIDADE': 'bg-emerald-100 text-emerald-800',
      'ECOSSISTEMA': 'bg-cyan-100 text-cyan-800',
      'VAREJO': 'bg-pink-100 text-pink-800',
      'NEGOCIOS DE ATACADO': 'bg-indigo-100 text-indigo-800',
      'HABITACAO': 'bg-yellow-100 text-yellow-800',
      'GOVERNO': 'bg-gray-100 text-gray-800',
      'FUNDO DE INVESTIMENTO': 'bg-green-100 text-green-800',
      'FINANCAS E CONTROLADORIA': 'bg-blue-100 text-blue-800',
      'LOGISTICAS, OPERACOES E SEGURANCA': 'bg-red-100 text-red-800',
      'RISCOS': 'bg-orange-100 text-orange-800',
      'PESSOAS': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const cardBorderStyle = variant === 'excellent' 
    ? 'border-l-4 border-l-green-500 shadow-lg hover:shadow-xl' 
    : 'border-l-4 border-l-blue-500 shadow-md hover:shadow-lg';

  return (
    <div
      className={`bg-white rounded-lg p-6 transition-all duration-300 cursor-pointer border border-gray-200 ${cardBorderStyle}`}
      onClick={onClick}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-3">
          <h5 className="font-bold text-gray-900 text-base line-clamp-2 mb-2">
            {idea.title}
          </h5>
          {/* Categoria */}
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category || 'GERAL')}`}>
            {idea.category || 'GERAL'}
          </span>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {/* Badge de Score Premium */}
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreStyle(idea.score)}`}>
            {idea.score}
          </span>
        </div>
      </div>

      {/* Badges Especiais */}
      <div className="flex flex-wrap gap-2 mb-4">
        {variant === 'excellent' && (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 rounded-full text-xs font-bold border border-yellow-300">
            <span>⭐</span>
            <span>EXCELENTE</span>
          </span>
        )}
        {isQuickWin && (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-300">
            <Zap className="w-3 h-3" />
            <span>Quick Win</span>
          </span>
        )}
        {isPriority && (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium border border-red-300">
            <Target className="w-3 h-3" />
            <span>Prioridade</span>
          </span>
        )}
      </div>

      {/* Descrição Detalhada */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
          {idea.content}
        </p>
      </div>

      {/* Métricas com barras de progresso */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Impacto</span>
            <span className={`text-xs font-bold ${
              idea.impact === 'Alto' ? 'text-green-600' :
              idea.impact === 'Médio' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {idea.impact}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                idea.impact === 'Alto' ? 'bg-green-500' :
                idea.impact === 'Médio' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
              style={{
                width: idea.impact === 'Alto' ? '90%' : idea.impact === 'Médio' ? '60%' : '30%'
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Urgência</span>
            <span className={`text-xs font-bold ${
              idea.urgency === 'Alta' ? 'text-red-600' :
              idea.urgency === 'Média' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {idea.urgency}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                idea.urgency === 'Alta' ? 'bg-red-500' :
                idea.urgency === 'Média' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
              style={{
                width: idea.urgency === 'Alta' ? '90%' : idea.urgency === 'Média' ? '60%' : '30%'
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Complexidade</span>
            <span className={`text-xs font-bold ${
              idea.complexity === 'Baixa' ? 'text-green-600' :
              idea.complexity === 'Média' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {idea.complexity}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                idea.complexity === 'Baixa' ? 'bg-green-500' :
                idea.complexity === 'Média' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{
                width: idea.complexity === 'Baixa' ? '30%' : idea.complexity === 'Média' ? '60%' : '90%'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
            idea.status === 'Em Análise' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
            idea.status === 'Aprovada' ? 'bg-green-100 text-green-800 border border-green-300' :
            idea.status === 'Rejeitada' ? 'bg-red-100 text-red-800 border border-red-300' :
            'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            {idea.status}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-gray-900">{idea.author}</div>
          <div className="text-xs text-gray-500">
            {new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: '2-digit'
            }).format(idea.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCardDetailed;