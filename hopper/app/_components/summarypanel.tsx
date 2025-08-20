import React from "react";
import { Brain } from "lucide-react";
import { Idea } from "../_types";
import IdeaCard from "./ideacard";

interface SummaryPanelProps {
  ideas: Idea[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ ideas }) => {
  return (
    <div
      className="w-80 border-l border-gray-200 p-6"
      style={{ backgroundColor: "#F6F6F6" }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#3A485A" }}>
        Resumo das Ideias
      </h2>

      {ideas.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nenhuma ideia registrada ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;
