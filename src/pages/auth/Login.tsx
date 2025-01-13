import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

/**
 * Login page component
 * Handles user authentication and role selection
 */
export default function Login() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [error, setError] = useState<string>('');

  useAuthRedirect({ selectedRole, setError });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#6E59A5] p-4">
      <div className="w-full max-w-md space-y-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D6BCFA] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-[#9b87f5] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-300"></div>
        
        <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-purple-100">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] bg-clip-text text-transparent">
              RampUP
            </h2>
            <p className="text-gray-600">
              Accelerate your sales journey
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Role Selection */}
          <RoleSelector 
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />

          {/* Auth Form */}
          <AuthForm />
        </div>
      </div>
    </div>
  );
}