// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const validateEnvVars = () => {
    return !!(supabaseUrl && supabaseAnonKey);
};

export async function POST(request: Request) {
    if (!validateEnvVars()) {
        return NextResponse.json({ error: 'Invalid environment configuration' }, { status: 500 });
    }

    let email, password;
    try {
        const body = await request.json();
        email = body.email;
        password = body.password;

        // --- Input Validation ---
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

    } catch (error) {
        console.error("Error during body parsing/validation:", error); // <-- Add log
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }


    try {
        const supabase = createClient(supabaseUrl!, supabaseAnonKey!, { /* ... */ });

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        // Handle Supabase signup errors
        if (signUpError) {
            return NextResponse.json({ error: signUpError.message }, { status: 400 }); // Ensure ALL error paths return!
        }

        // --- Handle Success ---
        if (data.user) {
            
            // Explicitly sign in the user
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (signInError) {
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

        return NextResponse.json({ error: 'Registration failed' }, { status: 400 }); // Ensure fallback returns!

    } catch (error) {
        console.error("Error during Supabase interaction:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}