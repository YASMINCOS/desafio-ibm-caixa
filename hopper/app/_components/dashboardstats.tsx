import React from "react";
import { Clock, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  color: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  color,
  icon,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm mt-1 ${color}`}>{change}</p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            color.includes("green")
              ? "bg-green-100"
              : color.includes("blue")
              ? "bg-blue-100"
              : color.includes("yellow")
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total de Ideias"
        value="156"
        change="+12% este mês"
        color="text-green-600"
        icon={<Lightbulb className="w-6 h-6 text-green-600" />}
      />
      <StatsCard
        title="Em Análise"
        value="23"
        change="8 novas hoje"
        color="text-blue-600"
        icon={<Clock className="w-6 h-6 text-blue-600" />}
      />
      <StatsCard
        title="Implementadas"
        value="45"
        change="+5 esta semana"
        color="text-green-600"
        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
      />
      <StatsCard
        title="Problemas Ativos"
        value="12"
        change="3 críticos"
        color="text-red-600"
        icon={<AlertCircle className="w-6 h-6 text-red-600" />}
      />
    </div>
  );
};

export default DashboardStats;
