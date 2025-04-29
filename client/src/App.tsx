import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AuthPage from "@/pages/auth";
import MessengerPage from "@/pages/messenger";
import NotFound from "@/pages/not-found";

// Protected route component
function ProtectedRoute({ 
  component: Component, 
  ...rest 
}: { 
  component: React.ComponentType,
  [x: string]: any 
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    // You can add a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return <Component {...rest} />;
}

// Auth route - redirects to messenger if already logged in
function AuthRoute({ 
  component: Component, 
  ...rest 
}: { 
  component: React.ComponentType,
  [x: string]: any 
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={MessengerPage} />} />
      <Route path="/auth" component={() => <AuthRoute component={AuthPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
