// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        // console.log("Token in middleware: ", req.nextauth.token); // Optional: Log token

        // Example: Redirect based on role (if you added role to token in callbacks)
        // if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
        //   return NextResponse.rewrite(new URL("/denied", req.url));
        // }

        // If no specific redirects are needed based on token, just return undefined or NextResponse.next()
        // The main job of protecting matched routes is done by the configuration below.
        return NextResponse.next();
    },
    {
        callbacks: {
            // This callback determines if the user is authorized.
            // If it returns true, the middleware function above is executed.
            // If false, the user is redirected to the login page.
            authorized: ({ token }) => {
                // !!token checks if the token exists and is not null/undefined.
                // This is the basic check for authentication.
                return !!token;
            }
        },
        pages: {
            // Redirect users to this page if they are not authorized.
            // This should match the path to your login page component.
            //signIn: "/login",
            // error: "/auth/error", // Optional: Error page
        },
    }
);

// Configures which paths the middleware should run on.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes including /api/auth for NextAuth)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (the login page itself to avoid redirect loops)
         * - Optionally add other public paths like /signup here
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
        // You might want a simpler matcher initially, like just protecting the app routes:
        // '/app/:path*', // If you decide to put authenticated routes under /app/ (URL path)
        // Or protect the root path if non-logged in users should always see login:
        // '/',
    ],
};