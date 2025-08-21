"use client";

import React, { useEffect, useCallback, useState } from "react";

interface WatsonxChatProps {
  orchestrationID: string;
  hostURL: string;
  crn: string;
  agentId: string;
  agentEnvironmentId: string;
  showLauncher?: boolean;
}

export default function WatsonxChat(props: WatsonxChatProps) {
  const [mounted, setMounted] = useState(false);
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Verificar se está no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  const initializeWatsonx = useCallback(() => {
    if (!mounted || typeof window === "undefined") return;

    // Validar props obrigatórias
    const requiredProps = [
      "orchestrationID",
      "hostURL",
      "crn",
      "agentId",
      "agentEnvironmentId",
    ];
    const missingProps = requiredProps.filter(
      (prop) => !props[prop as keyof WatsonxChatProps]
    );

    if (missingProps.length > 0) {
      setErrorMessage(
        `Propriedades obrigatórias ausentes: ${missingProps.join(", ")}`
      );
      setLoadState("error");
      return;
    }

    // Verificar se ainda são valores placeholder
    if (
      props.orchestrationID.includes("SEU_") ||
      props.agentId.includes("SEU_") ||
      props.crn.includes("SEU_")
    ) {
      setErrorMessage(
        "Configurações ainda não foram definidas. Configure o .env.local"
      );
      setLoadState("error");
      return;
    }

    setLoadState("loading");

    try {
      // Limpar configurações anteriores
      if ((window as any).wxOConfiguration) {
        delete (window as any).wxOConfiguration;
      }

      // Configurar watsonx
      (window as any).wxOConfiguration = {
        orchestrationID: props.orchestrationID,
        hostURL: props.hostURL,
        rootElementID: "watsonx-chat-root",
        showLauncher: props.showLauncher ?? true,
        crn: props.crn,
        deploymentPlatform: "ibmcloud",
        chatOptions: {
          agentId: props.agentId,
          agentEnvironmentId: props.agentEnvironmentId,
        },
      };

      // Carregar script
      const script = document.createElement("script");
      script.id = "watsonx-script";
      script.src = `${props.hostURL}/wxochat/wxoLoader.js?embed=true`;
      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          try {
            if (
              (window as any).wxoLoader &&
              typeof (window as any).wxoLoader.init === "function"
            ) {
              (window as any).wxoLoader.init();
              setLoadState("loaded");
            } else {
              setErrorMessage("wxoLoader não disponível");
              setLoadState("error");
            }
          } catch (initError) {
            console.error("Erro ao inicializar wxoLoader:", initError);
            setErrorMessage("Erro ao inicializar o chat");
            setLoadState("error");
          }
        }, 100);
      };

      script.onerror = () => {
        setErrorMessage("Falha ao carregar script do watsonx");
        setLoadState("error");
      };

      // Remover script anterior se existir
      const existingScript = document.getElementById("watsonx-script");
      if (existingScript) {
        existingScript.remove();
      }

      document.head.appendChild(script);
    } catch (error) {
      console.error("Erro na configuração:", error);
      setErrorMessage("Erro na configuração do watsonx");
      setLoadState("error");
    }
  }, [mounted, props]);

  useEffect(() => {
    if (mounted) {
      initializeWatsonx();
    }

    // Cleanup
    return () => {
      const script = document.getElementById("watsonx-script");
      if (script) {
        script.remove();
      }
      if ((window as any).wxOConfiguration) {
        delete (window as any).wxOConfiguration;
      }
    };
  }, [initializeWatsonx]);

  // Não renderizar no servidor
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded mb-2"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
        </div>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erro no watsonx Chat
          </h3>
          <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
          <button
            onClick={() => {
              setLoadState("idle");
              setErrorMessage("");
              initializeWatsonx();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (loadState === "loading") {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Carregando watsonx Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div
        id="watsonx-chat-root"
        className="h-full w-full"
        // style={{ minHeight: "300px" }}
      />
    </div>
  );
}
