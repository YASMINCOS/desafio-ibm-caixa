"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  Lightbulb,
  User,
  Building,
  Target,
  Cogs,
  TrendingUp,
} from "lucide-react";

interface IdeaFormData {
  nomeProponente: string;
  matriculaProponente: string;
  unidadeProponente: string;
  nomeExperimento: string;
  equipeEnvolvida: string;
  desafioProblema: string;
  solucaoDescricao: string;
  metodologiaExecucao: string;
  hipotesePrincipal: string;
  horizonteInovacao: "Curto" | "Médio" | "Longo";
  baselineAtual: string;
  resultadosEsperados: string;
  kpisSmart: string;
  categoria:
    | "OPERACIONAL"
    | "ESTRATÉGICA"
    | "TECNOLÓGICA"
    | "COMERCIAL"
    | "SUSTENTABILIDADE";
  avaliacaoIA: string;
  avaliacaoHumana: string;
}

interface IdeaCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (idea: any) => void;
  currentUser: {
    name: string;
    id: string;
    department: string;
  };
}

export default function IdeaCreationModal({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}: IdeaCreationModalProps) {
  const [formData, setFormData] = useState<IdeaFormData>({
    nomeProponente: currentUser.name,
    matriculaProponente: currentUser.id,
    unidadeProponente: currentUser.department,
    nomeExperimento: "",
    equipeEnvolvida: "",
    desafioProblema: "",
    solucaoDescricao: "",
    metodologiaExecucao: "",
    hipotesePrincipal: "",
    horizonteInovacao: "Médio",
    baselineAtual: "",
    resultadosEsperados: "",
    kpisSmart: "",
    categoria: "OPERACIONAL",
    avaliacaoIA: "",
    avaliacaoHumana: "Pendente de avaliação",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field: keyof IdeaFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Gerar avaliação IA baseada nos dados do formulário
      const avaliacaoIA = generateIAEvaluation(formData);

      const payload = {
        ...formData,
        avaliacaoIA,
      };

      const response = await fetch("https://api.hmo.patinhaas.com.br/ideias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      // Callback de sucesso
      onSuccess({
        id: result.id || Date.now(),
        title: formData.nomeExperimento,
        content: formData.solucaoDescricao,
        impact: getImpactFromCategory(formData.categoria),
        urgency: getUrgencyFromHorizon(formData.horizonteInovacao),
        complexity: getComplexityFromDescription(formData.solucaoDescricao),
        status: "Em Análise",
        timestamp: new Date(),
        author: formData.nomeProponente,
        category: formData.categoria,
        apiResponse: result,
      });

      // Resetar formulário
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro ao criar ideia:", error);
      alert(
        `Erro ao criar ideia: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateIAEvaluation = (data: IdeaFormData): string => {
    const complexity = getComplexityFromDescription(data.solucaoDescricao);
    const impact = getImpactFromCategory(data.categoria);

    let evaluation = "";

    if (impact === "Alto" && complexity === "Baixa") {
      evaluation =
        "Proposta altamente recomendada: alto impacto com baixa complexidade de implementação";
    } else if (impact === "Alto" && complexity === "Média") {
      evaluation =
        "Proposta tecnicamente viável com alto impacto, requer planejamento cuidadoso";
    } else if (impact === "Alto" && complexity === "Alta") {
      evaluation =
        "Proposta de alto impacto mas alta complexidade, recomenda-se implementação por fases";
    } else if (impact === "Médio") {
      evaluation = "Proposta com impacto moderado, boa relação custo-benefício";
    } else {
      evaluation =
        "Proposta de baixo risco, pode servir como piloto para ideias maiores";
    }

    // Adicionar insights específicos baseados na categoria
    switch (data.categoria) {
      case "TECNOLÓGICA":
        evaluation +=
          ". Recomenda-se validação técnica com arquitetos de solução";
        break;
      case "OPERACIONAL":
        evaluation +=
          ". Sugere-se teste piloto com métricas de eficiência bem definidas";
        break;
      case "ESTRATÉGICA":
        evaluation += ". Alinhamento com objetivos estratégicos identificado";
        break;
      case "COMERCIAL":
        evaluation +=
          ". Potencial de impacto no resultado financeiro identificado";
        break;
      case "SUSTENTABILIDADE":
        evaluation += ". Contribuição positiva para metas de sustentabilidade";
        break;
    }

    return evaluation;
  };

  const getImpactFromCategory = (
    categoria: string
  ): "Alto" | "Médio" | "Baixo" => {
    switch (categoria) {
      case "ESTRATÉGICA":
        return "Alto";
      case "COMERCIAL":
        return "Alto";
      case "TECNOLÓGICA":
        return "Médio";
      case "OPERACIONAL":
        return "Médio";
      case "SUSTENTABILIDADE":
        return "Baixo";
      default:
        return "Médio";
    }
  };

  const getUrgencyFromHorizon = (
    horizonte: string
  ): "Alta" | "Média" | "Baixa" => {
    switch (horizonte) {
      case "Curto":
        return "Alta";
      case "Médio":
        return "Média";
      case "Longo":
        return "Baixa";
      default:
        return "Média";
    }
  };

  const getComplexityFromDescription = (
    descricao: string
  ): "Alta" | "Média" | "Baixa" => {
    const complexKeywords = [
      "integração",
      "sistema",
      "arquitetura",
      "algoritmo",
      "machine learning",
      "blockchain",
    ];
    const text = descricao.toLowerCase();
    const matches = complexKeywords.filter((keyword) =>
      text.includes(keyword)
    ).length;

    if (matches > 2) return "Alta";
    if (matches > 0) return "Média";
    return "Baixa";
  };

  const resetForm = () => {
    setFormData({
      nomeProponente: currentUser.name,
      matriculaProponente: currentUser.id,
      unidadeProponente: currentUser.department,
      nomeExperimento: "",
      equipeEnvolvida: "",
      desafioProblema: "",
      solucaoDescricao: "",
      metodologiaExecucao: "",
      hipotesePrincipal: "",
      horizonteInovacao: "Médio",
      baselineAtual: "",
      resultadosEsperados: "",
      kpisSmart: "",
      categoria: "OPERACIONAL",
      avaliacaoIA: "",
      avaliacaoHumana: "Pendente de avaliação",
    });
    setCurrentStep(1);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.nomeExperimento &&
          formData.desafioProblema &&
          formData.solucaoDescricao
        );
      case 2:
        return !!(
          formData.equipeEnvolvida &&
          formData.metodologiaExecucao &&
          formData.hipotesePrincipal
        );
      case 3:
        return !!(
          formData.baselineAtual &&
          formData.resultadosEsperados &&
          formData.kpisSmart
        );
      case 4:
        return !!formData.categoria;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200"
          style={{ backgroundColor: "#005CAA" }}
        >
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">
              Nova Ideia de Inovação
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% completo
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#005CAA",
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Step 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Proponente
                  </label>
                  <input
                    type="text"
                    value={formData.nomeProponente}
                    onChange={(e) =>
                      handleInputChange("nomeProponente", e.target.value)
                    }
                    className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    value={formData.matriculaProponente}
                    onChange={(e) =>
                      handleInputChange("matriculaProponente", e.target.value)
                    }
                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidade
                  </label>
                  <input
                    type="text"
                    value={formData.unidadeProponente}
                    onChange={(e) =>
                      handleInputChange("unidadeProponente", e.target.value)
                    }
                    className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Experimento *
                </label>
                <input
                  type="text"
                  value={formData.nomeExperimento}
                  onChange={(e) =>
                    handleInputChange("nomeExperimento", e.target.value)
                  }
                  placeholder="Ex: Sistema de Cache Inteligente"
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desafio/Problema *
                </label>
                <textarea
                  value={formData.desafioProblema}
                  onChange={(e) =>
                    handleInputChange("desafioProblema", e.target.value)
                  }
                  placeholder="Descreva o problema ou desafio que sua ideia pretende resolver..."
                  rows={3}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição da Solução *
                </label>
                <textarea
                  value={formData.solucaoDescricao}
                  onChange={(e) =>
                    handleInputChange("solucaoDescricao", e.target.value)
                  }
                  placeholder="Descreva sua proposta de solução..."
                  rows={3}
                  className="text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Execução */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Cogs className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Planejamento de Execução
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipe Envolvida *
                </label>
                <input
                  type="text"
                  value={formData.equipeEnvolvida}
                  onChange={(e) =>
                    handleInputChange("equipeEnvolvida", e.target.value)
                  }
                  placeholder="Ex: Equipe de Backend, DevOps e QA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metodologia de Execução *
                </label>
                <textarea
                  value={formData.metodologiaExecucao}
                  onChange={(e) =>
                    handleInputChange("metodologiaExecucao", e.target.value)
                  }
                  placeholder="Descreva como planeja executar a solução..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hipótese Principal *
                </label>
                <textarea
                  value={formData.hipotesePrincipal}
                  onChange={(e) =>
                    handleInputChange("hipotesePrincipal", e.target.value)
                  }
                  placeholder="Qual é sua hipótese sobre os resultados esperados?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horizonte de Inovação
                </label>
                <select
                  value={formData.horizonteInovacao}
                  onChange={(e) =>
                    handleInputChange("horizonteInovacao", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Curto">Curto Prazo (até 6 meses)</option>
                  <option value="Médio">Médio Prazo (6-18 meses)</option>
                  <option value="Longo">Longo Prazo (18+ meses)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Métricas */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Métricas e Resultados
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baseline Atual *
                </label>
                <input
                  type="text"
                  value={formData.baselineAtual}
                  onChange={(e) =>
                    handleInputChange("baselineAtual", e.target.value)
                  }
                  placeholder="Ex: Tempo médio de resposta: 2.5 segundos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultados Esperados *
                </label>
                <textarea
                  value={formData.resultadosEsperados}
                  onChange={(e) =>
                    handleInputChange("resultadosEsperados", e.target.value)
                  }
                  placeholder="Descreva os resultados que espera alcançar..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KPIs SMART *
                </label>
                <input
                  type="text"
                  value={formData.kpisSmart}
                  onChange={(e) =>
                    handleInputChange("kpisSmart", e.target.value)
                  }
                  placeholder="Ex: Tempo de resposta < 1s em 95% das requisições"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Categorização */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Categorização Final
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    handleInputChange("categoria", e.target.value as any)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="OPERACIONAL">
                    Operacional - Melhoria de processos
                  </option>
                  <option value="TECNOLÓGICA">
                    Tecnológica - Inovação técnica
                  </option>
                  <option value="ESTRATÉGICA">
                    Estratégica - Impacto no negócio
                  </option>
                  <option value="COMERCIAL">
                    Comercial - Geração de receita
                  </option>
                  <option value="SUSTENTABILIDADE">
                    Sustentabilidade - Impacto ambiental
                  </option>
                </select>
              </div>

              {/* Preview da Avaliação IA */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Preview da Avaliação IA:
                </h4>
                <p className="text-sm text-blue-800">
                  {generateIAEvaluation(formData)}
                </p>
              </div>

              {/* Resumo */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Resumo da Ideia:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Experimento:</span>{" "}
                    {formData.nomeExperimento}
                  </div>
                  <div>
                    <span className="font-medium">Categoria:</span>{" "}
                    {formData.categoria}
                  </div>
                  <div>
                    <span className="font-medium">Horizonte:</span>{" "}
                    {formData.horizonteInovacao}
                  </div>
                  <div>
                    <span className="font-medium">Proponente:</span>{" "}
                    {formData.nomeProponente}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
          </div>

          <div className="flex space-x-2">
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#005CAA" }}
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="flex items-center space-x-2 px-6 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#005CAA" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Criar Ideia</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
