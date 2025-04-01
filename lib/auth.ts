// lib/auth.ts
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';

// Fetch Supabase URL and Anon Key from environment variables
// These are available server-side via process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Basic validation to ensure variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🔴 Missing Supabase environment variables");
    throw new Error("Missing Supabase environment variables");
}


export const authOptions: NextAuthOptions = {
    // Using JWT strategy for sessions
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            // The name to display on the sign-in form (optional)
            name: 'Credentials',
            // `credentials` is used to generate a form on the built-in sign-in page.
            // You can specify which fields should be submitted. The property names MUST match
            // what you expect in the `authorize` function's `credentials` object.
            

            
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validate that credentials exist (NextAuth already does some validation)

                console.log("✅ HI");

                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing email or password in authorize');
                    return null; // Returning null indicates failure
                }

                try {
                    // Create a Supabase client *specifically for this authorization attempt*
                    // Using the ANON key is sufficient for signInWithPassword
                    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                        // Optional: Prevents Supabase client from persisting session,
                        // letting NextAuth handle session management entirely.
                        auth: { persistSession: false }
                    });

                    // Attempt to sign in with Supabase using the provided credentials
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    // Handle Supabase sign-in errors
                    if (error || !data.user) {
                        console.error("Supabase Sign-In Error:", error?.message);
                        // Returning null signifies authentication failure to NextAuth
                        // You could throw an error here to provide more specific feedback,
                        // but returning null is the standard way to indicate invalid credentials.
                        return null;
                    }

                    // If successful, return an object representing the authenticated user.
                    // This object will be encoded in the JWT. It MUST have at least `id`.
                    console.log("✅ Supabase Sign-In Success for:", data.user.email);

                    console.log("✅ Supabase Sign-In Success for:", data.session.access_token);
                    return {
                        id: data.user.id,
                        email: data.user.email,
                        accessToken: data.session.access_token,
                        // You can add other relevant, non-sensitive user data here if needed
                        // e.g., name: data.user.user_metadata?.full_name,
                        // e.g., role: data.user.role, // If you have custom roles
                    };

                } catch (err) {
                    console.error("Error in authorize function:", err);
                    return null; // Return null on any unexpected error
                }
            }
        })
        // You can add other providers here later (e.g., Google, GitHub)
        // import GoogleProvider from "next-auth/providers/google";
        // GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    ],

    // Callbacks are functions executed at specific points in the auth flow
    callbacks: {
        // The `jwt` callback is invoked when a JWT is created or updated.
        // `user` is only passed on initial sign-in.
        async jwt({ token, user }) {
            // If `user` object exists (passed from authorize on successful login),
            // persist its details (like the id) to the JWT token.
            if (user) {
                token.id = user.id;
                if ('accessToken' in user && user.accessToken) {
                    token.accessToken = user.accessToken;
                }
                // Add any other properties from the user object you returned in authorize
                // token.role = user.role;
            }
            return token; // The token is then encrypted and stored in the session cookie
        },

        // The `session` callback is invoked when a session is checked.
        // `token` contains the decrypted JWT contents.
        async session({ session, token }) {
            // Pass user details from the JWT token to the client-side session object.
            // Make sure `session.user` exists before assigning properties.
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            if (session.user && token.email) {
                session.user.email = token.email;
            }

            if (session.user && token.accessToken) {
                session.user.accessToken = token.accessToken as string; 
            }
            // Add any other properties from the token you want accessible in the client session
            // if (session.user && token.role) {
            //   session.user.role = token.role;
            // }
            return session; // The session object is returned to the client
        },
    },

    // Optional: Specify custom pages if you want to override NextAuth's defaults
    pages: {
        //signIn: '/login', // Redirect users to /login if they need to sign in
        // error: '/auth/error', // Optional: Page to display auth errors
    },

    // The secret used to sign and encrypt JWTs and session cookies
    secret: process.env.NEXTAUTH_SECRET,
};