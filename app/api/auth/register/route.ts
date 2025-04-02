// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const validateEnvVars = () => {
    return !!(supabaseUrl && supabaseAnonKey);
};

export async function POST(request: Request) {
    console.log("--- ORIGINAL REGISTER POST REACHED ---"); // <-- Add log

    if (!validateEnvVars()) {
        console.log("Env var validation failed"); // <-- Add log
        return NextResponse.json({ error: 'Invalid environment configuration' }, { status: 500 });
    }

    let email, password;
    try {
        console.log("Parsing request body..."); // <-- Add log
        const body = await request.json();
        email = body.email;
        password = body.password;
        console.log("Body parsed:", { email: email ? 'present' : 'missing', password: password ? 'present' : 'missing' }); // <-- Add log

        // --- Input Validation ---
        if (!email || !password) {
            console.log("Input validation failed: Missing email/password"); // <-- Add log
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        // ... other validation ...
        if (password.length < 8) {
            console.log("Input validation failed: Password too short"); // <-- Add log
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }
        console.log("Input validation passed"); // <-- Add log

    } catch (error) {
        console.error("Error during body parsing/validation:", error); // <-- Add log
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }


    try {
        console.log("Creating Supabase client..."); // <-- Add log
        const supabase = createClient(supabaseUrl!, supabaseAnonKey!, { /* ... */ });
        console.log("Supabase client created."); // <-- Add log

        console.log(`Attempting Supabase signup for: ${email}`); // <-- Add log
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        console.log("Supabase signUp call completed.", { hasError: !!signUpError }); // <-- Add log

        // Handle Supabase signup errors
        if (signUpError) {
            console.log("Handling Supabase signUp error:", signUpError.message); // <-- Add log
            // ... your error handling logic ...
            return NextResponse.json({ error: signUpError.message }, { status: 400 }); // Ensure ALL error paths return!
        }

        // --- Handle Success ---
        if (data.user) {
            console.log("Handling Supabase signUp success."); // <-- Add log
            
            // Explicitly sign in the user
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (signInError) {
                console.log("Auto-login failed:", signInError.message);
                // Still return success since signup worked
                return NextResponse.json({ 
                    success: true, 
                    user: data.user,
                    session: data.session,
                    warning: "Auto-login failed"
                }, { status: 201 });
            }

            return NextResponse.json({ 
                success: true, 
                user: data.user,
                session: signInData.session
            }, { status: 201 });
        }

        console.log("Fallback: Supabase success but no user data."); // <-- Add log
        return NextResponse.json({ error: 'Registration failed' }, { status: 400 }); // Ensure fallback returns!

    } catch (error: any) {
        console.error("Unhandled Error during Supabase interaction:", error); // <-- Add log
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}