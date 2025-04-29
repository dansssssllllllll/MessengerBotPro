import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { availableCommands } from "@/lib/commandProcessor";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserProfileButton from "./UserProfileButton";

type Command = {
  name: string;
  description: string;
};

export default function CommandSidebar() {
  const [commands, setCommands] = useState<Command[]>(availableCommands);
  
  // Fetch commands from the API
  const { data } = useQuery({
    queryKey: ['/api/commands'],
    enabled: true,
  });
  
  useEffect(() => {
    if (data) {
      setCommands(data);
    }
  }, [data]);

  return (
    <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Commands</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {commands.map((command) => (
            <div 
              key={command.name}
              className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <h3 className="font-medium text-gray-800 dark:text-gray-200">/{command.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{command.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t dark:border-gray-700">
        <UserProfileButton />
      </div>
    </div>
  );
}
