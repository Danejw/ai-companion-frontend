// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Ensure path is correct

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };