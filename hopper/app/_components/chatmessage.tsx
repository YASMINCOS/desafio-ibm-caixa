import React from "react";
import { User, Bot } from "lucide-react";

interface Message {
  id: number;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-start space-x-2 max-w-xs lg:max-w-md xl:max-w-lg ${
          message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
            message.type === "user" ? "bg-blue-500" : "bg-gray-400"
          }`}
        >
          {message.type === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
        <div
          className={`rounded-lg px-4 py-2 ${
            message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
          style={{
            backgroundColor: message.type === "user" ? "#005CAA" : "#F8F9FA",
            color: message.type === "user" ? "white" : "#3A485A",
          }}
        >
          <p className="text-sm">{message.content}</p>
          <p
            className={`text-xs mt-1 ${
              message.type === "user" ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
