import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

const registerSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthForms() {
  const [activeTab, setActiveTab] = useState<string>("signin");
  const { login, register } = useAuth();
  const { toast } = useToast();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error("Login error:", error);
      // Error is already handled in the auth context
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      // Omit confirmPassword as it's not needed for API call
      const { confirmPassword, ...userData } = values;
      await register(userData);
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } catch (error) {
      console.error("Registration error:", error);
      // Error is already handled in the auth context
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-primary dark:text-blue-400">Messenger Bot</h2>
        <p className="text-gray-600 dark:text-gray-400">Sign in or create an account</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={loginForm.control}
                  name="remember"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                      <label 
                        htmlFor="remember"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
              
              <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="signup">
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                {registerForm.formState.isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
