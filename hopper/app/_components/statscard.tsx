import React from "react";
import {
  Home,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  BarChart3,
  Settings,
  User as UserIconLucide,
  Mail,
} from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}

type ActiveView = "dashboard" | "chat" | "ideas" | "problems" | "analytics";

interface SidebarProps {
  user: User;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeView,
  onViewChange,
}) => {
  const menuItems = [
    { id: "dashboard" as ActiveView, label: "Dashboard", icon: Home },
    { id: "chat" as ActiveView, label: "Chat IA", icon: MessageSquare },
    { id: "ideas" as ActiveView, label: "Ideias", icon: Lightbulb },
    { id: "problems" as ActiveView, label: "Problemas", icon: AlertTriangle },
    { id: "analytics" as ActiveView, label: "Análises", icon: BarChart3 },
  ];

  return (
    <div className="w-64 h-full bg-white shadow-lg flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Image
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserIconLucide className="w-4 h-4" />
            <span>{user.department}</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: activeView === item.id ? "#EBF5FF" : "",
                  color: activeView === item.id ? "#005CAA" : "",
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
