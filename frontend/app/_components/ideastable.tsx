import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

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
}

interface IdeasTableProps {
  ideas: Idea[];
  onView?: (idea: Idea) => void;
  onEdit?: (idea: Idea) => void;
  onDelete?: (idea: Idea) => void;
}

const IdeasTable: React.FC<IdeasTableProps> = ({ ideas, onView, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'Em Análise': 'bg-yellow-100 text-yellow-800',
      'Aprovada': 'bg-green-100 text-green-800',
      'Rejeitada': 'bg-red-100 text-red-800',
      'Implementada': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (impact: string, urgency: string) => {
    if (impact === 'Alto' && urgency === 'Alta') return 'bg-red-100 text-red-800';
    if (impact === 'Alto' || urgency === 'Alta') return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Ideias Recentes</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ideas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {idea.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {idea.content}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(idea.status)}`}>
                    {idea.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(idea.impact, idea.urgency)}`}>
                    {idea.impact} / {idea.urgency}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {idea.author}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {idea.timestamp.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(idea)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(idea)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(idea)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IdeasTable;