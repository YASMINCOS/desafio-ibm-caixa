import { Metadata } from "next";
import MainApp from "./_components/mainapp";

export const metadata: Metadata = {
  title: "Sandbox CAIXA - Sistema de Ideias e Inovação",
  description: "Plataforma integrada para gerenciamento de ideias",
};

export default function HomePage() {
  return <MainApp />;
}
