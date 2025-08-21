import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Problem } from "../_types";

interface ProblemsTableProps {
  problems: Problem[];
  onView?: (problem: Problem) => void;
  onEdit?: (problem: Problem) => void;
  onDelete?: (problem: Problem) => void;
}

const ProblemTable: React.FC<ProblemsTableProps> = ({
  problems,
  onView,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      "Em Análise": "bg-yellow-100 text-yellow-800",
      Aprovada: "bg-green-100 text-green-800",
      Rejeitada: "bg-red-100 text-red-800",
      Implementada: "bg-blue-100 text-blue-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (impact: string, urgency: string) => {
    if (impact === "Alto" && urgency === "Alta")
      return "bg-red-100 text-red-800";
    if (impact === "Alto" || urgency === "Alta")
      return "bg-orange-100 text-orange-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Problemas Recentes</h3>
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
            {problems.map((problem) => (
              <tr key={problem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {problem.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {problem.content}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      problem.status
                    )}`}
                  >
                    {problem.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      problem.impact,
                      problem.urgency
                    )}`}
                  >
                    {problem.impact} / {problem.urgency}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {problem.author}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {problem.timestamp.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(problem)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(problem)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {/* {onDelete && (
                      <button
                        onClick={() => onDelete(idea)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )} */}
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

export default ProblemTable;
