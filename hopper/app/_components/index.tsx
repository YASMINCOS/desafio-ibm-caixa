// pages/test-watsonx.tsx ou app/test-watsonx/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

export default function TestWatsonxPage() {
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useState({
    orchestrationID: "",
    hostURL: "",
    crn: "",
    agentId: "",
    agentEnvironmentId: ""
  });

  useEffect(() => {
    setIsClient(true);
    
    // Carregar configurações do ambiente
    setConfig({
      orchestrationID: process.env.NEXT_PUBLIC_WATSONX_ORCHESTRATION_ID || "",
      hostURL: process.env.NEXT_PUBLIC_WATSONX_HOST_URL || "https://us-south.watson-orchestrate.cloud.ibm.com",
      crn: process.env.NEXT_PUBLIC_WATSONX_CRN || "",
      agentId: process.env.NEXT_PUBLIC_WATSONX_AGENT_ID || "",
      agentEnvironmentId: process.env.NEXT_PUBLIC_WATSONX_ENVIRONMENT_ID || ""
    });
  }, []);

  const handleTestEmbed = () => {
    if (!isClient || typeof window === 'undefined') return;

    try {
      // Limpar configuração anterior
      if ((window as any).wxOConfiguration) {
        delete (window as any).wxOConfiguration;
      }

      // Configurar
      (window as any).wxOConfiguration = {
        orchestrationID: config.orchestrationID,
        hostURL: config.hostURL,
        rootElementID: "test-watsonx-root",
        showLauncher: true,
        crn: config.crn,
        deploymentPlatform: "ibmcloud",
        chatOptions: {
          agentId: config.agentId,
          agentEnvironmentId: config.agentEnvironmentId
        }
      };

      // Carregar script
      const script = document.createElement('script');
      script.src = `${config.hostURL}/wxochat/wxoLoader.js?embed=true`;
      script.onload = () => {
        if ((window as any).wxoLoader) {
          (window as any).wxoLoader.init();
        }
      };
      document.head.appendChild(script);

    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao configurar watsonx: ' + error);
    }
  };

  if (!isClient) {
    return <div>Carregando...</div>;
  }

  const isConfigured = config.orchestrationID && 
                      config.agentId && 
                      config.crn && 
                      !config.orchestrationID.includes('SEU_');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Teste watsonx Orchestrate
        </h1>

        {/* Status da Configuração */}
        <div className="bg-white rounded-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">Status da Configuração</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Orchestration ID:</span>
              <span className={`ml-2 ${config.orchestrationID ? 'text-green-600' : 'text-red-600'}`}>
                {config.orchestrationID ? '✓ Configurado' : '✗ Não configurado'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">Agent ID:</span>
              <span className={`ml-2 ${config.agentId ? 'text-green-600' : 'text-red-600'}`}>
                {config.agentId ? '✓ Configurado' : '✗ Não configurado'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">CRN:</span>
              <span className={`ml-2 ${config.crn ? 'text-green-600' : 'text-red-600'}`}>
                {config.crn ? '✓ Configurado' : '✗ Não configurado'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">Host URL:</span>
              <span className={`ml-2 ${config.hostURL ? 'text-green-600' : 'text-red-600'}`}>
                {config.hostURL ? '✓ Configurado' : '✗ Não configurado'}
              </span>
            </div>
          </div>

          {!isConfigured && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Configuração necessária:</strong> Configure as variáveis no arquivo .env.local
              </p>
            </div>
          )}
        </div>

        {/* Botão de Teste */}
        <div className="bg-white rounded-lg p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">Teste Manual</h2>
          
          <button
            onClick={handleTestEmbed}
            disabled={!isConfigured}
            className={`px-6 py-3 rounded-lg font-medium ${
              isConfigured 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isConfigured ? 'Testar watsonx Chat' : 'Configuração Incompleta'}
          </button>

          <p className="text-sm text-gray-600 mt-2">
            Clique para carregar o chat do watsonx Orchestrate
          </p>
        </div>

        {/* Container do Chat */}
        <div className="bg-white rounded-lg border" style={{ minHeight: '400px' }}>
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium">watsonx Chat Container</h3>
          </div>
          <div className="p-4">
            <div id="test-watsonx-root" style={{ minHeight: '350px' }}>
              <div className="flex items-center justify-center h-full text-gray-500">
                {isConfigured 
                  ? 'Clique no botão "Testar watsonx Chat" para carregar o chat'
                  : 'Configure as variáveis de ambiente primeiro'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-lg p-6 mt-6 border">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}