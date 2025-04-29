import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { availableCommands } from "@/lib/commandProcessor";
import UserProfileButton from "./UserProfileButton";

type MobileCommandMenuProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MobileCommandMenu({ isOpen, setIsOpen }: MobileCommandMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 h-full w-64 overflow-y-auto transform transition-transform">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Commands</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-3">
            {availableCommands.map((command) => (
              <div 
                key={command.name}
                className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                onClick={() => setIsOpen(false)}
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-200">/{command.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{command.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t dark:border-gray-700">
          <UserProfileButton mobile={true} />
        </div>
      </div>
    </div>
  );
}
