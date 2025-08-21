import React from "react";
import { BarChart3, Zap, Target } from "lucide-react";
import DashboardStats from "./dashboardstats";
import IdeaCardDetailed from "./ideacarddeitailed";

interface Idea {
  id: number;
  title: string;
  content: string;
  impact: "Alto" | "Médio" | "Baixo";
  urgency: "Alta" | "Média" | "Baixa";
  complexity: "Alta" | "Média" | "Baixa";
  status: "Em Análise" | "Aprovada" | "Rejeitada" | "Implementada";
  timestamp: Date;
  author: string;
  category?: string;
}

interface DashboardProps {
  ideas: Idea[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setActiveView: (view: string) => void;
  calculateIdeaScore: (idea: Idea) => number;
  handleIdeaAction: (action: string, idea: Idea) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  ideas,
  selectedCategory,
  setSelectedCategory,
  setActiveView,
  calculateIdeaScore,
  handleIdeaAction,
}) => {
  const categories = [
    "TODAS",
    "OPERACIONAL",
    "TECNOLOGICA",
    "ATENDIMENTO",
    "COMPLIANCE",
    "GESTAO",
    "SUSTENTABILIDADE",
    "ECOSSISTEMA",
    "VAREJO",
    "NEGOCIOS DE ATACADO",
    "HABITACAO",
    "GOVERNO",
    "FUNDO DE INVESTIMENTO",
    "FINANCAS E CONTROLADORIA",
    "LOGISTICAS, OPERACOES E SEGURANCA",
    "RISCOS",
    "PESSOAS",
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard de Ideias
        </h1>
        <p className="text-gray-600">
          Sistema integrado com IBM Watson Orchestrate
        </p>
      </div>

      <DashboardStats />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Visão Geral das Ideias
        </h3>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {ideas.length}
            </div>
            <div className="text-sm text-blue-700">Total de Ideias</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {
                ideas.filter(
                  (i) => i.impact === "Alto" && i.complexity === "Baixa"
                ).length
              }
            </div>
            <div className="text-sm text-green-700">Quick Wins</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {
                ideas.filter((i) => i.impact === "Alto" && i.urgency === "Alta")
                  .length
              }
            </div>
            <div className="text-sm text-purple-700">Prioridades</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(
                (ideas.filter((i) => i.status === "Aprovada").length /
                  Math.max(ideas.length, 1)) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-orange-700">Taxa de Aprovação</div>
          </div>
        </div>

        {/* Filtros por Categoria */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Filtrar por Categoria
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="text-gray-600">
                    Categoria Selecionada:{" "}
                    <span className="font-medium text-gray-900">
                      {selectedCategory}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Exibindo:{" "}
                    <span className="font-medium text-green-700">
                      Apenas ideias Excelentes (90+)
                    </span>{" "}
                    e{" "}
                    <span className="font-medium text-blue-700">
                      Boas (60-89)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory("TODAS")}
                  className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded"
                >
                  Limpar Filtro
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards informativos não clicáveis */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 p-4 bg-green-100 text-green-800 rounded-lg">
            <Zap className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Quick Wins</div>
              <div className="text-sm opacity-80">
                {
                  ideas.filter(
                    (i) => i.impact === "Alto" && i.complexity === "Baixa"
                  ).length
                }{" "}
                disponíveis
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-red-100 text-red-800 rounded-lg">
            <Target className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Prioridades</div>
              <div className="text-sm opacity-80">
                {
                  ideas.filter(
                    (i) => i.impact === "Alto" && i.urgency === "Alta"
                  ).length
                }{" "}
                urgentes
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-purple-100 text-purple-800 rounded-lg">
            <BarChart3 className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Análises</div>
              <div className="text-sm opacity-80">Ver relatórios completos</div>
            </div>
          </div>
        </div>

        {/* Cards de Ideias */}
        <IdeaCardsSection
          ideas={ideas}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setActiveView={setActiveView}
          calculateIdeaScore={calculateIdeaScore}
          handleIdeaAction={handleIdeaAction}
        />
      </div>
    </div>
  );
};

// Componente separado para a seção de cards de ideias
const IdeaCardsSection: React.FC<{
  ideas: Idea[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setActiveView: (view: string) => void;
  calculateIdeaScore: (idea: Idea) => number;
  handleIdeaAction: (action: string, idea: Idea) => void;
}> = ({
  ideas,
  selectedCategory,
  setSelectedCategory,
  setActiveView,
  calculateIdeaScore,
  handleIdeaAction,
}) => {
  // Filtrar ideias - SOMENTE >= 60 pontos (Excelentes e Boas)
  let qualifiedIdeas = ideas
    .map((idea) => ({ ...idea, score: calculateIdeaScore(idea) }))
    .filter((idea) => idea.score >= 60);

  // Filtrar por categoria se não for 'TODAS'
  if (selectedCategory !== "TODAS") {
    qualifiedIdeas = qualifiedIdeas.filter(
      (idea) => idea.category === selectedCategory
    );
  }

  // Ordenar por score (melhor primeiro)
  qualifiedIdeas = qualifiedIdeas.sort((a, b) => b.score - a.score);

  // Categorizar por performance
  const excellentIdeas = qualifiedIdeas.filter((idea) => idea.score >= 90);
  const goodIdeas = qualifiedIdeas.filter(
    (idea) => idea.score >= 60 && idea.score < 90
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-900">
          {selectedCategory === "TODAS"
            ? "Ideias por Performance"
            : `Ideias da Categoria: ${selectedCategory}`}
        </h4>
        <div className="flex items-center space-x-2 text-sm">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Excelentes (90-100)
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Boas (60-89)
          </span>
          <span className="text-gray-500 text-xs">
            Ideias abaixo de 60 pontos não são exibidas
          </span>
        </div>
      </div>

      {qualifiedIdeas.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedCategory !== "TODAS"
              ? `Nenhuma ideia qualificada encontrada na categoria "${selectedCategory}"`
              : "Nenhuma ideia qualificada encontrada"}
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory !== "TODAS"
              ? "Esta categoria não possui ideias com pontuação ≥ 60 pontos"
              : "Não há ideias com pontuação suficiente (≥ 60 pontos)"}
          </p>
          {selectedCategory !== "TODAS" && (
            <button
              onClick={() => setSelectedCategory("TODAS")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Todas as Categorias
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Estatísticas da Categoria Selecionada */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {qualifiedIdeas.length}
                </div>
                <div className="text-sm font-medium text-blue-700">
                  {selectedCategory === "TODAS"
                    ? "Total Qualificadas"
                    : "Qualificadas na Categoria"}
                </div>
                <div className="text-xs text-gray-600">≥ 60 pontos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {excellentIdeas.length}
                </div>
                <div className="text-sm font-medium text-green-700">
                  Excelentes
                </div>
                <div className="text-xs text-gray-600">90-100 pontos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {goodIdeas.length}
                </div>
                <div className="text-sm font-medium text-blue-700">Boas</div>
                <div className="text-xs text-gray-600">60-89 pontos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {qualifiedIdeas.length > 0
                    ? Math.round(
                        (excellentIdeas.length / qualifiedIdeas.length) * 100
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm font-medium text-orange-700">
                  Taxa de Excelência
                </div>
                <div className="text-xs text-gray-600">Excelentes / Total</div>
              </div>
            </div>
          </div>

          {/* Cards das Ideias */}
          {selectedCategory !== "TODAS" ? (
            // Modo: Categoria específica - Cards simples
            <div className="space-y-8">
              {/* Ideias Excelentes */}
              {excellentIdeas.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <h4 className="text-xl font-bold text-green-800">
                      Ideias Excelentes ({excellentIdeas.length})
                    </h4>
                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      90-100 pontos
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {excellentIdeas.map((idea) => (
                      <IdeaCardDetailed
                        key={idea.id}
                        idea={idea}
                        variant="excellent"
                        onClick={() => handleIdeaAction("view", idea)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Ideias Boas */}
              {goodIdeas.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <h4 className="text-xl font-bold text-blue-800">
                      Ideias Boas ({goodIdeas.length})
                    </h4>
                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      60-89 pontos
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goodIdeas.map((idea) => (
                      <IdeaCardDetailed
                        key={idea.id}
                        idea={idea}
                        variant="good"
                        onClick={() => handleIdeaAction("view", idea)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Modo: Todas as categorias - Visão agrupada
            <div className="space-y-8">
              {(() => {
                const groupedByCategory = qualifiedIdeas.reduce(
                  (groups, idea) => {
                    const category = idea.category || "OUTRAS";
                    if (!groups[category]) {
                      groups[category] = [];
                    }
                    groups[category].push(idea);
                    return groups;
                  },
                  {} as { [key: string]: (Idea & { score: number })[] }
                );

                return Object.entries(groupedByCategory)
                  .sort(([, a], [, b]) => {
                    const excellentA = a.filter(
                      (idea) => idea.score >= 90
                    ).length;
                    const excellentB = b.filter(
                      (idea) => idea.score >= 90
                    ).length;
                    return excellentB - excellentA;
                  })
                  .map(([category, categoryIdeas]) => (
                    <div
                      key={category}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {category}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {categoryIdeas.length} ideias
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryIdeas.slice(0, 3).map((idea) => (
                          <IdeaCardDetailed
                            key={idea.id}
                            idea={idea}
                            variant={idea.score >= 90 ? "excellent" : "good"}
                            onClick={() => handleIdeaAction("view", idea)}
                          />
                        ))}
                      </div>

                      {categoryIdeas.length > 3 && (
                        <div className="text-center mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setSelectedCategory(category)}
                            className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Ver todas as {categoryIdeas.length} ideias da
                            categoria {category}
                          </button>
                        </div>
                      )}
                    </div>
                  ));
              })()}
            </div>
          )}

          {/* Link para seção completa - apenas se categoria específica */}
          {selectedCategory !== "TODAS" && (
            <div className="text-center pt-8 border-t border-gray-200">
              <button
                onClick={() => setActiveView("ideas")}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span>Explorar seção completa de ideias</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
