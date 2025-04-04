// components/overlays/AuthOverlay.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import { Loader2 } from 'lucide-react'; // Example icons

// Simple Spinner component (or use one from a library)
const Spinner = () => <Loader2 className="mr-2 h-4 w-4 animate-spin" />;

// --- Define Props Interface ---
interface AuthOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void; // Function to toggle state in parent
}

// --- Use Props in Component Definition ---
export default function AuthOverlay({ open, onOpenChange }: AuthOverlayProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form States (Credentials)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [name, setName] = useState(''); // Uncomment if using name for signup

    // Clear form state and errors when tab changes or overlay visibility changes
    useEffect(() => {
        // Always clear fields/errors when tab changes OR visibility changes (open prop)
        setEmail('');
        setPassword('');
        // setName(''); // Uncomment if using name
        setError(null);
        setIsLoading(false); // Reset loading state as well

        // Optionally reset to login tab when overlay re-opens after being closed
        // if (open && !prevOpen) { // Need to track previous open state for this
        //    setActiveTab('login');
        // }
        // Simple approach: Reset to login only if tab changes
        // If you want to reset tab on re-open, requires more state logic
        // For now, just clearing fields is safer.

    }, [activeTab, open]); // Dependency array includes activeTab and open

    // --- Handlers ---
    const handleCredentialsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        if (activeTab === 'login') {
            // --- LOGIN LOGIC ---
            try {
                const result = await signIn('credentials', {
                    redirect: false, // Handle redirect manually
                    email,
                    password,
                });

                if (result?.error) {
                    const errorMessage = result.error === 'CredentialsSignin' ? 'Invalid email or password.' : result.error;
                    setError(errorMessage);
                    toast.error(`Login Failed: ${errorMessage}`);
                } else if (result?.ok) {
                    toast.success('Login Successful!');
                    onOpenChange(false); // <-- Use prop function to close
                    router.refresh(); // Refresh server components to reflect login state
                } else {
                    setError('An unknown error occurred during login.');
                    toast.error(`Login Failed: Unknown error`);
                }
            } catch (err) {
                console.error("Login submit error:", err);
                setError('An unexpected error occurred.');
                toast.error(`Login Failed: ${err}`);
            } finally {
                setIsLoading(false);
            }

        } else {
            // --- SIGN UP LOGIC ---
            // Client-side validation (optional but recommended)
            if (password.length < 8) {
                setError("Password must be at least 8 characters long.");
                toast.warning("Password Too Short");
                setIsLoading(false);
                return;
            }

            try {
                console.log(`Attempting signup via fetch to /api/auth/register for: ${email}`);
                // Call the dedicated API route we created
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                // Always try to parse the JSON body, even for errors
                const data = await response.json();
                console.log("Signup API response:", { status: response.status, body: data });

                if (!response.ok) {
                    // Use the message from the API response if available, otherwise generic error
                    const errorMessage = data?.message || `Sign up failed (Status: ${response.status})`;
                    setError(errorMessage);
                    toast.error('Sign Up Failed');
                } else {
                    // Use the success message from the API response
                    toast.success('Sign Up Request Successful!');
                    setActiveTab('login'); // Switch to login tab
                    // Keep email populated for convenience, clear password
                    setEmail(email);
                    setPassword('');
                    // Do not close the overlay, prompt user to check email or log in
                }
            } catch (err) { // Catch network errors during fetch itself
                console.error("Signup fetch network error:", err);
                setError('An unexpected network error occurred during sign up.');
                toast.error('Sign Up Failed');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // const handleOAuthSignIn = async (provider: 'google' /* | 'github' | etc */) => {
    //     setIsLoading(true);
    //     setError(null); // Clear previous errors
    //     try {
    //         await signIn(provider, { callbackUrl: '/app' }); // Redirect to app after successful OAuth
    //         // On success, NextAuth redirects, overlay will close as page changes/refreshes
    //     } catch (err) {
    //         console.error("OAuth signin error:", err);
    //         const message = `Failed to sign in with ${provider}.`;
    //         setError(message);
    //         toast.error('OAuth Sign In Failed', { description: message });
    //         setIsLoading(false); // Only reached if signIn itself throws before redirect
    //     }
    //     // Don't set isLoading false here if successful, as redirect should happen
    // };

    // --- Use Props for the Dialog ---
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[450px]"
                onInteractOutside={(e) => {
                    // Prevent closing by clicking outside only if loading
                    if (isLoading) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    // Prevent closing via Escape key only if loading
                    if (isLoading) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-center text-2xl">
                        {activeTab === 'login' ? 'Welcome Back!' : 'Create Account'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {activeTab === 'login'
                            ? 'Log in to access your account.'
                            : 'Sign up to get started.'}
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
                            <div className="grid gap-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email" type="email" placeholder="you@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    required disabled={isLoading} autoComplete="email"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password" type="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required disabled={isLoading} autoComplete="current-password"
                                />
                            </div>
                            {error && activeTab === 'login' && (
                                <p className="text-sm text-center text-destructive">{error}</p>
                            )}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Spinner /> : 'Login'}
                            </Button>
                        </form>

                        {/* OAuth Separator */}
                        {/* <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                        </div> */}

                        {/* OAuth Buttons */}
                        {/* <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" onClick={() => handleOAuthSignIn('google')} disabled={isLoading}>
                                {isLoading ? <Spinner /> : <ChromeIcon className="mr-2 h-4 w-4" />} Google
                            </Button>
                        </div> */}
                    </TabsContent>

                    {/* --- SIGN UP TAB --- */}
                    <TabsContent value="signup">
                        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                            {/* Uncomment if using name
                             <div className="grid gap-2">
                                <Label htmlFor="signup-name">Name</Label>
                                <Input id="signup-name" placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} required disabled={isLoading} autoComplete="name"/>
                            </div> */}

                            <div className="grid gap-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email" type="email" placeholder="you@example.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    required disabled={isLoading} autoComplete="email"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password" type="password"
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    required disabled={isLoading} minLength={8} autoComplete="new-password"
                                />
                            </div>

                            {error && activeTab === 'signup' && (
                                <p className="text-sm text-center text-destructive">{error}</p>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Spinner /> : 'Create Account'}
                            </Button>

                        </form>

                        {/* OAuth Options on Signup Tab */}
                        {/* <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or sign up with</span></div>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" onClick={() => handleOAuthSignIn('google')} disabled={isLoading}>
                                {isLoading ? <Spinner /> : <ChromeIcon className="mr-2 h-4 w-4" />} Google
                            </Button>
                        </div> */}

                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}