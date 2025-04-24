'use client';

import Background from "@/components/Background";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Get token from hash fragment
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.includes('access_token=')) {
        // Extract the access_token from the URL hash
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        console.log("Found access token in URL hash");
        setToken(accessToken);
      } else {
        console.warn("No access token found in URL hash");
      }
    }
  }, []);
  
  const handleSuccess = () => {
    router.push('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <Background />

        <div className="w-full max-w-md mx-auto p-6 rounded-lg">
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm token={token || undefined} onSuccess={handleSuccess} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 