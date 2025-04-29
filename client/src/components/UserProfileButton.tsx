import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type UserProfileButtonProps = {
  mobile?: boolean;
};

export default function UserProfileButton({ mobile = false }: UserProfileButtonProps) {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  // Generate user initials for avatar
  const getInitials = () => {
    if (!user.fullname) return "U";
    return user.fullname
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center">
      <Avatar className="h-8 w-8 bg-primary text-white">
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="ml-2">
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          {user.fullname}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.email}
        </p>
      </div>
      <Button
        variant="ghost" 
        size="icon"
        onClick={handleLogout}
        className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Logout"
        id={mobile ? "mobile-logout-button" : "logout-button"}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}
