import React from "react";
import { TrendingUp, Clock, Brain } from "lucide-react";
import { Idea } from "../_types";

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const getCardColor = (
    type: "impact" | "urgency" | "complexity",
    value: string
  ): string => {
    const colors = {
      impact: {
        Alto: "bg-red-100 border-red-300 text-red-800",
        Médio: "bg-orange-100 border-orange-300 text-orange-800",
        Baixo: "bg-green-100 border-green-300 text-green-800",
      },
      urgency: {
        Alta: "bg-yellow-100 border-yellow-300 text-yellow-800",
        Média: "bg-yellow-50 border-yellow-200 text-yellow-700",
        Baixa: "bg-green-100 border-green-300 text-green-800",
      },
      complexity: {
        Alta: "bg-purple-100 border-purple-300 text-purple-800",
        Média: "bg-blue-100 border-blue-300 text-blue-800",
        Baixa: "bg-green-100 border-green-300 text-green-800",
      },
    };
    return (
      colors[type][value as keyof (typeof colors)[typeof type]] ||
      "bg-gray-100 border-gray-300 text-gray-800"
    );
  };

  const getIcon = (type: "impact" | "urgency" | "complexity"): JSX.Element => {
    const icons = {
      impact: <TrendingUp className="w-4 h-4" />,
      urgency: <Clock className="w-4 h-4" />,
      complexity: <Brain className="w-4 h-4" />,
    };
    return icons[type];
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="font-medium mb-2" style={{ color: "#3A485A" }}>
        {idea.title}
      </h3>
      <p className="text-sm text-gray-600 mb-3">{idea.content}</p>

      <div className="space-y-2">
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 ${getCardColor(
            "impact",
            idea.impact
          )}`}
        >
          <div className="flex items-center space-x-2">
            {getIcon("impact")}
            <span className="text-sm font-medium">Impacto</span>
          </div>
          <span className="text-sm font-semibold">{idea.impact}</span>
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 ${getCardColor(
            "urgency",
            idea.urgency
          )}`}
        >
          <div className="flex items-center space-x-2">
            {getIcon("urgency")}
            <span className="text-sm font-medium">Urgência</span>
          </div>
          <span className="text-sm font-semibold">{idea.urgency}</span>
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg border-2 ${getCardColor(
            "complexity",
            idea.complexity
          )}`}
        >
          <div className="flex items-center space-x-2">
            {getIcon("complexity")}
            <span className="text-sm font-medium">Complexidade</span>
          </div>
          <span className="text-sm font-semibold">{idea.complexity}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {idea.timestamp.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default IdeaCard;
