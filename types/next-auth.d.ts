// types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the JWT type
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        /** User ID from Supabase */
        id?: string;
        // Add any other properties you added in the jwt callback (e.g., role)
    }
}

// Extend the Session type
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's unique ID from Supabase */
            id?: string; // <-- Add the 'id' property here
        } & DefaultSession["user"]; // Combine with default properties (name, email, image)
    }

    // Optional: Extend the User type (usually matches the object returned by authorize)
    interface User extends DefaultUser {
        id: string; // Ensure the User type also reflects the ID from authorize
        // Add any other properties returned from authorize (e.g., role)
    }
}