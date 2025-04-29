import { useEffect, useRef } from "react";
import { parseBotMessage } from "@/lib/commandProcessor";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

type Message = {
  id: number;
  userId: number;
  content: string;
  isBot: boolean;
  createdAt: Date;
};

export default function MessageList() {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages from the API
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/messages'],
    enabled: !!user,
  });
  
  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // If there are no messages, show a welcome message
  const displayMessages = messages.length > 0 ? messages : [
    {
      id: 0,
      userId: 0,
      content: JSON.stringify({
        content: "Welcome to the Messenger Bot! Type /help to see available commands."
      }),
      isBot: true,
      createdAt: new Date()
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 message-container bg-gray-50 dark:bg-gray-900">
      <div className="space-y-4">
        {displayMessages.map((message) => {
          if (message.isBot) {
            const botMessage = parseBotMessage(message);
            return (
              <div key={message.id} className="flex items-start animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold mr-2">
                  <span>B</span>
                </div>
                <div className="message bot-message bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm max-w-[80%]">
                  {botMessage.title && (
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">{botMessage.title}</p>
                  )}
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {botMessage.content}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={message.id} className="flex items-start justify-end animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="message my-message bg-primary text-white p-3 rounded-lg shadow-sm max-w-[80%]">
                  <p>{message.content}</p>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
