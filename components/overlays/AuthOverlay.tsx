// components/overlays/AuthOverlay.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use App Router's router
// Removed direct useUIStore import

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner'; // For feedback
import { Loader2, ChromeIcon } from 'lucide-react'; // Example icons

// Simple Spinner component
const Spinner = () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

// --- Define Props Interface ---
interface AuthOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void; // Function to toggle state in parent
}

// --- Use Props in Component Definition ---
export default function AuthOverlay({ open, onOpenChange }: AuthOverlayProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Clear form state/errors when tab changes or overlay opens/closes
    useEffect(() => {
        setEmail('');
        setPassword('');
        setError(null);
        setIsLoading(false); // Reset loading state
        // Optionally reset tab to login when it opens, if desired
        // if (open) { setActiveTab('login'); }
    }, [activeTab, open]); // Dependencies

    // --- Handlers ---
    const handleCredentialsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        if (activeTab === 'login') {
            // LOGIN LOGIC
            try {
                const result = await signIn('credentials', { redirect: false, email, password });
                if (result?.error) {
                    const errorMessage = result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error;
                    setError(errorMessage);
                    toast.error('Login Failed', { description: errorMessage });
                } else if (result?.ok) {
                    toast.success('Login Successful!');
                    onOpenChange(false); // Close overlay programmatically on success
                    router.refresh();
                } else { /* ... handle unknown error ... */ }
            } catch (err) { /* ... handle unexpected error ... */ }
            finally { setIsLoading(false); }
        } else {
            // SIGN UP LOGIC
            try {
                const response = await fetch('/api/auth/register', { /* ... */ body: JSON.stringify({ email, password }) });
                const data = await response.json();
                if (!response.ok) { /* ... handle signup error ... */ }
                else {
                    toast.success('Sign Up Successful!', { description: 'Please log in.' });
                    setActiveTab('login');
                    setEmail(email); // Pre-fill email
                    setPassword(''); // Clear password
                    // Do NOT close overlay here
                }
            } catch (err) { /* ... handle unexpected error ... */ }
            finally { setIsLoading(false); }
        }
    };

    const handleOAuthSignIn = async (provider: 'google') => {
        setIsLoading(true);
        setError(null);
        try {
            // Let NextAuth handle redirect, which implicitly closes overlay
            await signIn(provider, { callbackUrl: '/app' });
        } catch (err) { /* ... handle error ... */ }
        // Don't setIsLoading(false) on success path due to redirect
    };

    // This handler is passed to the Dialog, but we prevent user-triggered closing below
    const handleOpenChange = (isOpen: boolean) => {
        // Only allow programmatic closing (e.g., after login) or if not loading
        if (!isLoading || !isOpen) { // Allow closing if not loading, OR if opening
            onOpenChange(isOpen);
        }
    };

    return (
        // Use handleOpenChange, but prevent user dismissal via interaction/escape handlers
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="sm:max-w-[450px]"
                onInteractOutside={(e) => {
                    // --- ALWAYS prevent closing via outside click for Auth ---
                    e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    // --- ALWAYS prevent closing via Escape key for Auth ---
                    e.preventDefault();
                }}
            // Add className="hide-auth-close" if you want to hide the X via CSS
            // In globals.css: .hide-auth-close > [data-radix-dialog-close] { display: none; }
            >
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-center text-2xl">
                        {activeTab === 'login' ? 'Welcome Back!' : 'Create Account'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {/* ... Description ... */}
                        {activeTab === 'login' ? 'Sign in to access your AI Companion.' : 'Sign up to get started.'}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login" disabled={isLoading}>Login</TabsTrigger>
                        <TabsTrigger value="signup" disabled={isLoading}>Sign Up</TabsTrigger>
                    </TabsList>

                    {/* --- LOGIN TAB --- */}
                    <TabsContent value="login">
                        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                            {/* ... Email Input ... */}
                            <div className="grid gap-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} autoComplete="email" />
                            </div>
                            {/* ... Password Input ... */}
                            <div className="grid gap-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} autoComplete="current-password" />
                            </div>
                            {/* ... Error Display ... */}
                            {error && activeTab === 'login' && (<p className="text-sm text-center text-destructive">{error}</p>)}
                            {/* ... Submit Button ... */}
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Spinner /> : 'Login'}</Button>
                        </form>
                        {/* ... OAuth Separator ... */}
                        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div></div>
                        {/* ... OAuth Buttons ... */}
                        <div className="grid grid-cols-1 gap-2"><Button variant="outline" onClick={() => handleOAuthSignIn('google')} disabled={isLoading}>{isLoading ? <Spinner /> : <ChromeIcon className="mr-2 h-4 w-4" />} Google</Button></div>
                    </TabsContent>

                    {/* --- SIGN UP TAB --- */}
                    <TabsContent value="signup">
                        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                            {/* ... Email Input ... */}
                            <div className="grid gap-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} autoComplete="email" />
                            </div>
                            {/* ... Password Input ... */}
                            <div className="grid gap-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} minLength={8} autoComplete="new-password" />
                            </div>
                            {/* ... Error Display ... */}
                            {error && activeTab === 'signup' && (<p className="text-sm text-center text-destructive">{error}</p>)}
                            {/* ... Submit Button ... */}
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? <Spinner /> : 'Create Account'}</Button>
                        </form>
                        {/* ... OAuth Separator ... */}
                        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div></div>
                        {/* ... OAuth Buttons ... */}
                        <div className="grid grid-cols-1 gap-2"><Button variant="outline" onClick={() => handleOAuthSignIn('google')} disabled={isLoading}>{isLoading ? <Spinner /> : <ChromeIcon className="mr-2 h-4 w-4" />} Google</Button></div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}