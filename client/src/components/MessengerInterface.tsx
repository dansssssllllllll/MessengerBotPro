import { useState } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommandSidebar from "./CommandSidebar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import MobileCommandMenu from "./MobileCommandMenu";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function MessengerInterface() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  const getInitials = () => {
    if (!user?.fullname) return "U";
    return user.fullname
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <CommandSidebar />
      
      {/* Mobile menu */}
      <MobileCommandMenu isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between border-b dark:border-gray-700">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white mr-3"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Messenger Bot</h1>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white mx-2"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="ml-2 md:hidden">
              <Avatar className="h-8 w-8 bg-primary text-white">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Messages */}
        <MessageList />
        
        {/* Message Input */}
        <MessageInput />
      </div>
    </div>
  );
}
