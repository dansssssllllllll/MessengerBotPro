import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { availableCommands, getCommandName } from "@/lib/commandProcessor";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(availableCommands);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCommandClick = (command: string) => {
    setMessage(`/${command}`);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Filter commands when typing
  useEffect(() => {
    if (message.startsWith('/')) {
      const query = message.substring(1).toLowerCase();
      setFilteredCommands(
        availableCommands.filter(cmd => 
          cmd.name.toLowerCase().startsWith(query)
        )
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [message]);

  return (
    <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-3">
      <div className="flex items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type a message or command..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={sendMessageMutation.isPending}
        />
        <Button 
          onClick={handleSend}
          disabled={!message.trim() || sendMessageMutation.isPending}
          className="rounded-l-none"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {showSuggestions && filteredCommands.length > 0 && (
        <div className="mt-2 flex overflow-x-auto py-2 px-1 gap-2 commands-suggestions">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.name}
              onClick={() => handleCommandClick(cmd.name)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm whitespace-nowrap"
            >
              /{cmd.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
