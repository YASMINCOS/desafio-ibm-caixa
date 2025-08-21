// components/ChatWidget.tsx - Versão sem header
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Minimize2, Sparkles } from "lucide-react";

interface ChatWidgetProps {
  orchestrationID: string;
  hostURL: string;
  crn: string;
  agentId: string;
  agentEnvironmentId: string;
  onClose: () => void;
}

const ChatWidget = React.memo(function ChatWidget(props: ChatWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const removeHeaders = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Lista expandida de seletores para headers
    const headerSelectors = [
      '[class*="header"]',
      '[class*="Header"]',
      '[class*="toolbar"]',
      '[class*="Toolbar"]',
      '[class*="title"]',
      '[class*="Title"]',
      '[class*="top"]',
      '[class*="Top"]',
      '[class*="banner"]',
      '[class*="Banner"]',
      '[class*="nav"]',
      '[class*="Nav"]',
      '[data-testid*="header"]',
      '[data-testid*="toolbar"]',
      '[role="banner"]',
      "header",
      ".header",
      ".toolbar",
      ".wxo-header",
      ".wxo-toolbar",
      ".wxo-title",
      // Seletores específicos do watsonx que podem aparecer
      '[class*="wxo"]',
      '[id*="wxo"]',
      '[class*="watson"]',
      '[id*="watson"]',
    ];

    headerSelectors.forEach((selector) => {
      try {
        const elements = container.querySelectorAll(selector);
        elements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
            z-index: -1 !important;
          `;

          // Remove o elemento completamente se for um header óbvio
          if (
            htmlElement.tagName === "HEADER" ||
            htmlElement.className.toLowerCase().includes("header") ||
            htmlElement.className.toLowerCase().includes("toolbar")
          ) {
            htmlElement.remove();
          }
        });
      } catch (e) {
        // Ignora erros de seletores inválidos
      }
    });
  }, []);

  const cleanup = useCallback(() => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }

      const styles = document.getElementById("watsonx-widget-styles");
      if (styles) {
        styles.remove();
      }

      if (typeof window !== "undefined" && (window as any).wxOConfiguration) {
        delete (window as any).wxOConfiguration;
      }
    } catch (err) {
      console.warn("Erro durante cleanup:", err);
    }
  }, []);

  const initializeChat = useCallback(async () => {
    if (!isMounted || typeof window === "undefined") return;

    try {
      setError(null);

      if (!props.orchestrationID || !props.agentId || !props.crn) {
        setError("Configurações incompletas");
        return;
      }

      cleanup();

      const containerId = `watsonx-widget-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      if (containerRef.current) {
        containerRef.current.id = containerId;
      }

      // Configuração minimalista
      (window as any).wxOConfiguration = {
        orchestrationID: props.orchestrationID,
        hostURL: props.hostURL,
        rootElementID: containerId,
        showLauncher: false,
        crn: props.crn,
        deploymentPlatform: "ibmcloud",
        chatOptions: {
          agentId: props.agentId,
          agentEnvironmentId: props.agentEnvironmentId,
        },
        // Configurações extras para tentar desabilitar header
        customization: {
          hideHeader: true,
          hideToolbar: true,
          hideBranding: true,
          minimalist: true,
        },
      };

      // CSS super agressivo
      const styleElement = document.createElement("style");
      styleElement.id = "watsonx-widget-styles";
      styleElement.textContent = `
        #${containerId} {
          background: white !important;
          border: none !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          position: relative !important;
        }
        
        #${containerId} *,
        #${containerId} *:before,
        #${containerId} *:after {
          background-color: white !important;
          background: white !important;
        }
        
        /* Remove absolutamente TUDO que pode ser header */
        #${containerId} [class*="header" i],
        #${containerId} [class*="toolbar" i],
        #${containerId} [class*="title" i],
        #${containerId} [class*="top" i],
        #${containerId} [class*="banner" i],
        #${containerId} [class*="nav" i],
        #${containerId} [class*="wxo" i],
        #${containerId} [class*="watson" i],
        #${containerId} [id*="header" i],
        #${containerId} [id*="toolbar" i],
        #${containerId} [id*="wxo" i],
        #${containerId} [data-testid*="header"],
        #${containerId} [role="banner"],
        #${containerId} header,
        #${containerId} .header,
        #${containerId} .toolbar {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          max-height: 0 !important;
          overflow: hidden !important;
          position: absolute !important;
          top: -9999px !important;
          left: -9999px !important;
          z-index: -9999 !important;
          pointer-events: none !important;
        }
        
        #${containerId} iframe {
          background: white !important;
          border: none !important;
          width: 100% !important;
          height: 100% !important;
          display: block !important;
        }
        
        #${containerId} > div {
          height: 100% !important;
          background: white !important;
        }
        
        #${containerId} * {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `;

      document.head.appendChild(styleElement);

      // Script com parâmetros específicos
      const script = document.createElement("script");
      script.id = "watsonx-script";
      script.src = `${
        props.hostURL
      }/wxochat/wxoLoader.js?embed=true&hideHeader=true&minimal=true&t=${Date.now()}`;
      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          try {
            if (
              (window as any).wxoLoader &&
              typeof (window as any).wxoLoader.init === "function"
            ) {
              (window as any).wxoLoader.init();

              // Inicia remoção agressiva de headers
              removeHeaders();

              // Observer para mudanças no DOM
              observerRef.current = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === "childList") {
                    removeHeaders();
                  }
                });
              });

              if (containerRef.current) {
                observerRef.current.observe(containerRef.current, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ["class", "id", "style"],
                });
              }

              // Interval para remoção contínua (como último recurso)
              intervalRef.current = setInterval(removeHeaders, 500);

              setIsLoaded(true);
            } else {
              setError("Falha ao inicializar");
            }
          } catch (err) {
            console.error("Erro na inicialização:", err);
            setError("Erro de inicialização");
          }
        }, 1500); // Aumentei o timeout
      };

      script.onerror = () => {
        setError("Falha ao carregar script");
      };

      const existingScript = document.getElementById("watsonx-script");
      if (existingScript) {
        existingScript.remove();
      }

      document.head.appendChild(script);
      scriptRef.current = script;
    } catch (err) {
      console.error("Erro na configuração:", err);
      setError("Erro de configuração");
    }
  }, [isMounted, props, cleanup, removeHeaders]);

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(initializeChat, 100);
      return () => clearTimeout(timer);
    }
  }, [isMounted, initializeChat]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (!isMounted) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-sm">AI Assistant</span>
            </div>
            <button
              onClick={props.onClose}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-3">⚠️</div>
            <h3 className="font-medium text-gray-900 mb-2">Erro no Chat</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoaded(false);
                initializeChat();
              }}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 transition-all duration-300 ${
        isMinimized ? "h-14" : "h-[500px]"
      } flex flex-col overflow-hidden`}
    >
      {/* Header customizado */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white flex-shrink-0 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center relative">
              <MessageCircle className="w-5 h-5" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-medium text-sm">AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isLoaded ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                  }`}
                ></div>
                <p className="text-xs text-purple-100">
                  {isLoaded ? "Online" : "Conectando..."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded"
              title={isMinimized ? "Expandir" : "Minimizar"}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={props.onClose}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {!isMinimized && (
        <div className="flex-1 bg-white relative overflow-hidden">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Inicializando chat...</p>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className="w-full h-full bg-white"
            style={{
              minHeight: "400px",
              backgroundColor: "white",
              overflow: "hidden",
            }}
          />
        </div>
      )}
    </div>
  );
});

export default ChatWidget;
