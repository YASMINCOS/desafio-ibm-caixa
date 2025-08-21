// sidebar.tsx - Versão sem opções de chat
import React from "react";
import {
  LayoutDashboard,
  Lightbulb,
  AlertTriangle,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  user: any;
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({
  user,
  activeView,
  onViewChange,
}: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Visão geral do sistema",
    },
    {
      id: "ideas",
      label: "Ideias",
      icon: Lightbulb,
      description: "Gerencie ideias inovadoras",
    },
    {
      id: "problems",
      label: "Problemas",
      icon: AlertTriangle,
      description: "Acompanhe problemas reportados",
    },
  ];

  const bottomMenuItems = [
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      description: "Configurações do sistema",
    },
    {
      id: "help",
      label: "Ajuda",
      icon: HelpCircle,
      description: "Central de ajuda",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{user.role}</p>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">{user.department}</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Menu Principal
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={item.description}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>

                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Chat Info Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-blue-700">
              AI Assistant Online
            </span>
          </div>
          <p className="text-xs text-blue-600 leading-relaxed">
            Use o chat flutuante no canto inferior direito para conversar com o
            AI Assistant
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  // Implementar ações para configurações e ajuda
                  console.log(`Clicked ${item.id}`);
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                title={item.description}
              >
                <Icon className="mr-3 h-4 w-4 text-gray-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">Sandbox CAIXA v2.0</p>
          <p className="text-xs text-gray-400 mt-1">Powered by IBM Watson</p>
        </div>
      </div>
    </div>
  );
}
