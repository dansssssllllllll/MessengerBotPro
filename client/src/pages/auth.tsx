import AuthForms from "@/components/AuthForms";

export default function AuthPage() {
  return (
    <div className="auth-container w-full min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <AuthForms />
    </div>
  );
}
