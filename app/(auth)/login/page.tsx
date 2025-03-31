// app/(auth)/login/page.tsx
'use client'; // Necessary for form handling, state, and hooks

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { Button } from "@/components/ui/button"; // Adjust path if needed
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming you added sonner via shadcn

// Define the possible modes for the form
type AuthMode = 'login' | 'signup';

function LoginPage() {
    const router = useRouter(); // Re-enabled router for potential future redirects
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password field
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<AuthMode>('login'); // State to track 'login' or 'signup' mode

    // Handler for switching between login and signup modes
    const toggleMode = () => {
        setMode((prevMode) => (prevMode === 'login' ? 'signup' : 'login'));
        setError(null); // Clear errors when switching modes
        // Clear password fields when switching for security/UX
        setPassword('');
        setConfirmPassword('');
    };

    // Renamed original handleSubmit to handleLoginSubmit
    const handleLoginSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
            });

            if (result?.error) {
                console.error("Login failed:", result.error);
                setError("Invalid email or password. Please try again.");
                toast.error("Login Failed", { description: "Invalid email or password." });
                setIsLoading(false);
            } else if (result?.ok) {
                toast.success("Login Successful!");
                router.push('/'); // Redirect to the main app page after successful login
                // No need to setIsLoading(false) as we are navigating away
            } else {
                setError("An unexpected error occurred. Please try again.");
                toast.error("Login Error", { description: "An unexpected error occurred." });
                setIsLoading(false);
            }
        } catch (catchError) {
            console.error("SignIn exception:", catchError);
            setError("An unexpected error occurred during login.");
            toast.error("Login Error", { description: "An unexpected error occurred." });
            setIsLoading(false);
        }
    };

    // Handler for the signup submission
    const handleSignUpSubmit = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            toast.error("Signup Failed", { description: "Passwords do not match." });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Call the new API route for signing up
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle errors from the API route (e.g., user already exists)
                setError(data.error || 'Signup failed. Please try again.');
                toast.error("Signup Failed", { description: data.error || 'An unknown error occurred.' });
                setIsLoading(false);
            } else {
                // Signup successful via API, now attempt to log the user in
                toast.success("Signup successful! Logging you in...");
                const signInResult = await signIn('credentials', {
                    redirect: false,
                    email: email,
                    password: password,
                });

                if (signInResult?.error) {
                    console.error("Auto-login after signup failed:", signInResult.error);
                    // Don't redirect, show error, user might need manual login
                    setError("Signup successful, but auto-login failed. Please try logging in manually.");
                    toast.error("Auto-Login Failed", { description: "Please log in manually." });
                    setIsLoading(false);
                     // Optionally switch back to login mode
                    setMode('login');
                    setPassword('');
                    setConfirmPassword('');
                } else if (signInResult?.ok) {
                    // Auto-login successful
                    toast.success("Login Successful!");
                    router.push('/'); // Redirect to the main app page
                    // No need to setIsLoading(false)
                } else {
                     setError("Signup successful, but an unexpected login issue occurred.");
                    toast.error("Login Error", { description: "Please try logging in manually." });
                    setIsLoading(false);
                    setMode('login');
                    setPassword('');
                    setConfirmPassword('');
                }
            }
        } catch (catchError) {
            console.error("SignUp fetch/process exception:", catchError);
            setError("An unexpected error occurred during signup.");
            toast.error("Signup Error", { description: "An unexpected network or server error occurred." });
            setIsLoading(false);
        }
    };

    // Combined submit handler that calls the correct function based on mode
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (mode === 'login') {
            handleLoginSubmit();
        } else {
            handleSignUpSubmit();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    {/* Dynamically set Card Title and Description based on mode */}
                    <CardTitle className="text-2xl">{mode === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
                    <CardDescription>
                        {mode === 'login'
                            ? 'Enter your email below to login to your AI Companion.'
                            : 'Enter your details below to create an account.'}
                    </CardDescription>
                </CardHeader>
                {/* Use the combined handleSubmit */}
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                // Added autocomplete hint for password managers
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                        </div>
                        {/* Conditionally render Confirm Password field only in signup mode */}
                        {mode === 'signup' && (
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                            </div>
                        )}
                        {error && (
                            <p className="text-sm font-medium text-destructive">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-4">
                         {/* Update button text based on mode and loading state */}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading
                                ? (mode === 'login' ? 'Signing In...' : 'Signing Up...')
                                : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                        </Button>
                         {/* Link/Button to toggle between modes */}
                        <p className="text-sm text-muted-foreground">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                            <Button variant="link" type="button" onClick={toggleMode} disabled={isLoading} className="p-0 h-auto font-semibold">
                                {mode === 'login' ? 'Sign Up' : 'Login'}
                            </Button>
                        </p>
                    </CardFooter>
                </form>
                {/* Removed old static footer comment */}
            </Card>
        </div>
    );
}

export default LoginPage;