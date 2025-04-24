'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/lib/api/account";


// Spinner component
const Spinner = () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
}

export function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get token from props or URL if not provided
  const resetToken = token || searchParams.get('token') || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate token
    if (!resetToken) {
      setError("Invalid or missing reset token");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await changePassword(resetToken, newPassword);
      
      if (result.success) {
        toast.success("Password updated successfully");
        
        // Call the success callback or redirect to login
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/login?message=password-reset-success');
        }
      } else {
        setError(result.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
        <p className="text-gray-500">Enter your new password below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={isLoading}
            required
            minLength={8}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={isLoading}
            required
          />
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
} 